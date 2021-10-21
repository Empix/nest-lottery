import { ValueTransformer } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UserPasswordTransformer implements ValueTransformer {
  from(value: string) {
    return value;
  }

  to(value: string) {
    return bcrypt.hashSync(value, 10);
  }
}
