import {
  codeToString,
  convert,
  detect,
  Encoding as EncodingTypes,
} from 'encoding-japanese';

export function detectEncodingAndCovertToString(fileBuffer: Buffer): string {
  const uint8Array = new Uint8Array(fileBuffer);
  const detectedEncoding = <EncodingTypes>detect(fileBuffer).toString();
  const convertedEncoding = convert(uint8Array, {
    from: detectedEncoding,
    to: 'UTF8',
  });
  return codeToString(convertedEncoding);
}
