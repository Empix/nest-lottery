import * as faker from 'faker';
import { GenerateGame } from './generateGame';
import { GenerateUser } from './generateUser';

export class GenerateBet {
  static lastID: number = 0;

  public generate(data: {} = {}) {
    const UserGenerator = new GenerateUser();
    const user = UserGenerator.generate();
    const GameGenerator = new GenerateGame();
    const game = GameGenerator.generate();

    const bet = {
      id: ++GenerateBet.lastID,
      numbers: [faker.datatype.number({ max: 20, min: 1, precision: 0 })],
      user,
      game,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const merged = { ...bet, ...data };

    return merged;
  }
}
