import * as mime from 'mime-types';

function getExtensionFromMimeType(mimeType: string) {
  return mime.extension(mimeType);
}

export { getExtensionFromMimeType };
