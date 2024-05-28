import { isQAEmailAuthorify } from '@/payments/payment_chargify/helpers';
import { faker } from '@faker-js/faker';

describe('isQAEmailAuthorify', () => {
  it('should return true for a valid QA email', () => {
    const email = 'user+qa123@authorify.com';
    expect(isQAEmailAuthorify(email)).toBe(true);
  });

  it('should faker.email return test false', () => {
    const email = faker.internet.email();
    expect(isQAEmailAuthorify(email)).toBe(false);
  });

  it('should return false for an invalid QA email', () => {
    const email = 'user+testeaq1@authorify.com';
    expect(isQAEmailAuthorify(email)).toBe(false);
  });

  it('should return false for a non-QA email', () => {
    const email = 'user@authorify.com';
    expect(isQAEmailAuthorify(email)).toBe(false);
  });

  it('should return false for an email with invalid format', () => {
    const email = 'invalid_email';
    expect(isQAEmailAuthorify(email)).toBe(false);
  });
});
