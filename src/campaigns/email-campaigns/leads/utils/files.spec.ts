import { detectEncodingAndCovertToString } from '@/campaigns/email-campaigns/leads/utils/files';
import { detect } from 'encoding-japanese';

describe('Campaign Module - Utils - Files', () => {
  it('Should same input as string format', () => {
    const input = 'this is a test';
    const buffer = Buffer.from(input);
    const output = detectEncodingAndCovertToString(buffer);

    expect(output).toBeDefined();
    expect(typeof output).toEqual('string');
    expect(output).toEqual(input);
    expect(detect(output)).toEqual('ASCII');
  });

  it('Should not fail with empty string', () => {
    const input = '';
    const buffer = Buffer.from(input);
    const output = detectEncodingAndCovertToString(buffer);

    expect(output).toBeDefined();
    expect(typeof output).toEqual('string');
    expect(output).toEqual(input);
  });
});
