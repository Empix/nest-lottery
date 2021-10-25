import * as faker from 'faker';

export class GenerateUser {
  static lastID: number = 0;

  public generate(data: {} = {}) {
    const randomRole = faker.random.arrayElement(['admin', 'player']);
    const user = {
      id: GenerateUser.lastID++,
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      secure_id: faker.datatype.uuid(),
      role: randomRole,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const merged = { ...user, ...data };

    return merged;
  }
}
