/**
 * Save blob to file with filename
 */
export function saveBlobFile(blob: FileResult | Blob, name = 'download.blob'): void {
  const result = isFileResult(blob);
  const fileName = result ? blob.name : name;
  const fileBlob = result ? blob.blob : blob;
  const nav = window.navigator as Navigator & { msSaveOrOpenBlob?: (blob: Blob, name?: string) => void };
  if (typeof nav?.msSaveOrOpenBlob === 'function') {
    nav.msSaveOrOpenBlob(fileBlob, fileName);
    return;
  }

  const link = document.createElement('a');
  const blobUrl = URL.createObjectURL(fileBlob);

  try {
    link.style.display = 'none';
    link.href = blobUrl;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');

    document.body.appendChild(link);

    let event: MouseEvent;
    try {
      event = new MouseEvent('click');
    }
    catch {
      // fallback
      event = document.createEvent('MouseEvent');
      event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }

    link.dispatchEvent(event);
  }
  finally {
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      (window.URL || window.webkitURL || window).revokeObjectURL(blobUrl);
    }, 10_000);
  }
}

export function parseContentDispositionFilename(disposition: string): string | undefined {
  let fallbackName: string | undefined;
  for (const part of disposition.split(';')) {
    const equalsIndex = part.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = part.slice(0, equalsIndex).trim().toLowerCase();
    let value = part.slice(equalsIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    if (key === 'filename*') {
      const match = value.match(/^(.*?)'(?:.*)'(.*)$/);
      const encoded = match ? match[2] : value;
      try {
        const decoded = decodeURIComponent(encoded);
        if (decoded) return decoded;
      }
      catch {
        if (encoded) return encoded;
      }
    }
    else if (key === 'filename') {
      fallbackName = value;
    }
  }

  if (fallbackName != null && fallbackName !== '') {
    try {
      return decodeURIComponent(fallbackName);
    }
    catch {
      return fallbackName;
    }
  }

  return undefined;
}

export function isBlobLike(data: SafeAny): data is Blob {
  return data != null
    && typeof data === 'object'
    && typeof data.arrayBuffer === 'function'
    && typeof data.text === 'function';
}
