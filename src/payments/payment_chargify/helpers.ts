/*
 * email example to apply auto refund
 * anything+qa1@authorify.com
 */
export function isQAEmailAuthorify(email: string): boolean {
  const regex = /\w+\+qa\d+@authorify\.com/;
  return regex.test(email);
}
