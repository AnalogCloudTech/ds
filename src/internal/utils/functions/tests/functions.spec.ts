import { resolveOrTimeout, retry } from '@/internal/utils/functions';

let attemptsBeforeSuccess = 0;
const mockCallback = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (attemptsBeforeSuccess > 0) {
        attemptsBeforeSuccess--;
        reject(new Error('Operation failed'));
        return;
      }
      resolve('Success');
    }, 50);
  });
};

describe('resolveOrTimeout function tests', () => {
  it('should resolve before timeout', async () => {
    const resolved = await resolveOrTimeout(mockCallback, 100);
    expect(resolved).toBe('Success');
  });

  it('should reject after timeout', async () => {
    await expect(resolveOrTimeout(mockCallback, 10)).rejects.toThrow(
      'Exceeded timeout',
    );
  });
});
describe('retry function tests', () => {
  beforeAll(() => {
    attemptsBeforeSuccess = 0;
  });

  it('should succeed on first attempt', async () => {
    attemptsBeforeSuccess = 0;

    const resultRetryRoutine = await retry(mockCallback, {
      delay: 100,
      maxRetries: 3,
    });

    expect(resultRetryRoutine).toBe('Success');
  });

  it('should succeed after some retries', async () => {
    attemptsBeforeSuccess = 2;
    let resultRetryRoutine: any;
    try {
      resultRetryRoutine = await retry(mockCallback, {
        delay: 500,
        maxRetries: 3,
      });
    } catch (error) {
      resultRetryRoutine = error;
    }
    expect(resultRetryRoutine).toBe('Success');
  });

  it('should throw after exceeding max retries', async () => {
    attemptsBeforeSuccess = 4;
    const initialTime = Date.now();
    await expect(
      retry(mockCallback, { delay: 500, maxRetries: 3 }),
    ).rejects.toThrow('Max retries reached');
    const finalTime = Date.now();
    expect(finalTime - initialTime).toBeGreaterThanOrEqual(1500);
  });
});
