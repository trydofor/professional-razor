import { defineEventHandler, readMultipartFormData } from 'h3';

/**
 * ```bash
 * curl -X POST http://localhost:3000/api/v1/formdata \
 *      -F "username=JohnDoe" \
 *      -F "avatar=@readme.md"
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "name": "username",
 *       "value": "JohnDoe"
 *     },
 *     {
 *       "name": "avatar",
 *       "value": "readme.md"
 *     }
 *   ]
 * }
 * ```
 */
export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  const data = formData == null
    ? null
    : formData.map(item => ({
        name: item.name,
        value: item.filename ?? item.data.toString(),
      }));

  return {
    success: data != null,
    data,
  };
});
