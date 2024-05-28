import { generate } from 'randomstring';

export class CommonHelper {
  randomGenerator() {
    return generate(8);
  }
}
