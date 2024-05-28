import { SNSMessage } from './parse-sns-response';
export default function extractEmailsFromSNSMessage(msg: SNSMessage): string[];
export declare function extractDiagnosticCode(snsMessage: SNSMessage): Array<string>;
