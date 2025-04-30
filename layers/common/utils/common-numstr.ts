function errorOrEmpty(err: boolean, safe = true) {
  if (err) {
    throw new Error(safe ? 'bad number' : 'unsafe number, use "decimal.js" instead');
  }
  return '';
}

function fixNumber(num: number, err: boolean) {
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return errorOrEmpty(err);
  }
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    return errorOrEmpty(err, false);
  }
  return num.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 20,
  });
}

function fixSignDot(str: string, pz: boolean, dt: boolean) {
  if (pz) str = str.slice(1);
  if (dt) str = str.slice(0, -1);
  return str === '-0' ? '0' : str;
}

/**
 * Check if string is a well-formatted number: ##(.###)?
 * Integer part cannot have leading zeros (except 0)
 * Decimal part can have trailing zeros
 * Separators (if any) will be removed
 *
 * @param str - The string to check
 * @param sep - The separator character for readability (default: ',')
 * @returns The normalized number string (without separators) if well-formatted, undefined otherwise
 *
 * @example
 * // Valid formats (return string)
 * isWellNum("123")          // "123"
 * isWellNum("-123")         // "-123"
 * isWellNum("1,234")        // "1234"
 * isWellNum("1,234.56")     // "1234.56"
 * isWellNum("12,34.56")     // "1234.56"     // separator position ignored
 * isWellNum("1_234", "_")   // "1234"        // custom separator
 * isWellNum("1.234_567", "_") // "1.234567"  // decimal part can use separator too
 */
export function isWellNum(str: string, sep: string = ','): string | undefined {
  const len = str.length;
  if (len === 0) return undefined;

  let tmp = '';
  let cur = 0;

  // Handle sign
  const c0 = str[0];
  const pz = c0 === '+';
  if (c0 === '-' || pz) {
    cur = 1;
  }
  if (cur === len) return undefined;

  // Check first digit (no leading zeros except single 0)
  if (str[cur] === '0') {
    if (cur + 1 === len) return fixSignDot(str, pz, false);
    if (str[cur + 1] !== '.') return undefined;
    cur += 2;
  }
  else if (str[cur] >= '1' && str[cur] <= '9') {
    cur++;
  }
  else {
    return undefined;
  }

  // Check remaining digits and handle separator
  let hasSep = false;
  while (cur < len && str[cur] !== '.') {
    const ch = str[cur];
    if (ch === sep) {
      if (!hasSep) {
        hasSep = true;
        tmp = str.slice(0, cur);
      }
    }
    else if (ch < '0' || ch > '9') {
      return undefined;
    }
    else if (hasSep) {
      tmp += ch;
    }
    cur++;
  }
  if (cur === len) {
    return fixSignDot(hasSep ? tmp : str, pz, false);
  }

  // Handle decimal part
  if (hasSep) {
    tmp += '.';
  }
  cur++; // skip the decimal point

  // Check remaining digits after decimal point
  let dt = true;
  while (cur < len) {
    const ch = str[cur];
    if (ch >= '0' && ch <= '9') {
      dt = false;
      if (hasSep) tmp += ch;
    }
    else if (ch === sep) {
      if (!hasSep) {
        hasSep = true;
        tmp = str.slice(0, cur);
      }
    }
    else {
      return undefined;
    }
    cur++;
  }

  // If ends with decimal point, remove it
  return fixSignDot(hasSep ? tmp : str, pz, dt);
}

/**
 * Fix number string to standard decimal format.
 * For simple format (##(.###)? or #,###(.###)?), return as is or remove commas.
 * For other formats, parse and reformat.
 * NOTE: For complex formatting or precision calculations, use decimal.js
 *
 * @example
 * // Simple formats (return as is)
 * fixNumStr("123")           // "123"
 * fixNumStr("-123")          // "-123"
 * fixNumStr("0.123")         // "0.123"
 * fixNumStr("-0.123")        // "-0.123"
 * fixNumStr("123.4560")      // "123.4560"
 *
 * // Thousand separator formats (remove commas)
 * fixNumStr("1,234")         // "1234"
 * fixNumStr("1,234.56")      // "1234.56"
 * fixNumStr("-1,234.56")     // "-1234.56"
 * fixNumStr("1,234,567.89")  // "1234567.89"
 *
 * // Other formats (parse and fix)
 * fixNumStr(".123")          // "0.123"
 * fixNumStr("000123")        // "123"
 * fixNumStr("1e3")           // "1000"
 *
 * // Invalid formats (error or empty)
 * fixNumStr("abc")           // Error or ""
 */
export function fixNumStr(numStr: string | number | null | undefined, err = true): string {
  if (numStr == null) return errorOrEmpty(err);
  if (typeof numStr === 'number') return fixNumber(numStr, err);

  const str = numStr.trim();
  if (str.length === 0) return errorOrEmpty(err);

  const well = isWellNum(str);
  return well ?? fixNumber(Number.parseFloat(str), err);
}

/**
 * Adjust well-formated NumStr precision based on the specified scale.
 * NOTE: For complex formatting or precision calculations, use decimal.js
 *
 * @example
 * // Basic numbers (positive scale)
 * cutNumStr(123, 2)       // "123.00"
 * cutNumStr(-123, 2)      // "-123.00"
 *
 * // Truncation (no rounding)
 * cutNumStr("1.999", 2)   // "1.99"
 * cutNumStr("-1.999", 2)  // "-1.99"
 *
 * // Zero scale (integer part)
 * cutNumStr("123.999", 0) // "123"
 * cutNumStr("-123.999", 0)// "-123"
 *
 * // Negative scale
 * cutNumStr("1234", -2)   // "1200"
 * cutNumStr("-1234", -2)  // "-1200"
 * cutNumStr("12", -2)     // "0"
 * cutNumStr("-12", -2)    // "0"
 */
export function cutNumStr(numStr: string | number, scale: number): string {
  const str = typeof numStr === 'number'
    ? numStr.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 })
    : numStr.trim();
  const di = str.indexOf('.');
  const ip = di >= 0 ? str.slice(0, di) : str;
  const dt = di >= 0 ? str.slice(di + 1) : '0';

  if (scale === 0) return ip;

  if (scale > 0) {
    const dl = dt.length;
    if (dl == scale) return `${ip}.${dt}`;
    if (dl < scale) return `${ip}.${dt.padEnd(scale, '0')}`;
    return `${ip}.${dt.slice(0, scale)}`;
  }

  const bs = -scale;
  const il = ip.length;
  const nl = ip.startsWith('-') ? il - 1 : il;
  return nl <= bs ? '0' : ip.slice(0, il - bs).padEnd(il, '0');
}
