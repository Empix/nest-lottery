import * as faker from 'faker';

export class GenerateGame {
  static lastID: number = 0;

  public generate(data: {} = {}) {
    const game = {
      id: GenerateGame.lastID++,
      type: faker.random.word(),
      description: faker.lorem.paragraph(),
      range: faker.datatype.number({ precision: 0, min: 10, max: 100 }),
      price: faker.datatype.number({ precision: 2, min: 1, max: 50 }),
      max_number: faker.datatype.number({ precision: 0, min: 10, max: 100 }),
      color: `#${faker.datatype.hexaDecimal(6)}`,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const merged = { ...game, ...data };

    return merged;
  }
}
