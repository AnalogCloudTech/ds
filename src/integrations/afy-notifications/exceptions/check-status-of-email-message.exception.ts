export class CheckStatusOfEmailMessageException extends Error {
  constructor(message = 'Failed to get email message status') {
    super(message);
  }
}
