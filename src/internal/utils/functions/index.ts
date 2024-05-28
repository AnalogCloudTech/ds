import { isNil, isUndefined, pickBy } from 'lodash';

export function PropertiesSanitizer<T extends object = any>(obj: T) {
  return pickBy<T>(obj, (value) => {
    return !(isNil(value) && isUndefined(value));
  });
}

export async function sleep(time: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

/**
 * Returns awaited promise, or if timeout is reached rejects with an error
 *
 * @param callback - Callback function to be executed
 * @param ms - Timeout in milliseconds
 * @returns Resolved or rejected callback
 */
export async function resolveOrTimeout<T>(
  callback: () => Promise<T>,
  ms: number,
) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Exceeded timeout'));
    }, ms);

    callback().then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/**
 * Returns awaited promise, or if max retry is reached rejects with an error
 *
 * @param callback - Callback function to be executed
 * @param options - Options for retry
 * @returns Resolved or rejected callback
 */
export async function retry<T>(
  callback: () => Promise<T>,
  { delay = 500, maxRetries = 5, timeout = 5000 },
) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await resolveOrTimeout(callback, timeout);
    } catch (e) {
      // TODO: log error
      retries++;
      await sleep(delay);
    }
  }
  throw new Error('Max retries reached');
}
