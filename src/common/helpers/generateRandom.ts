import { randomBytes } from 'crypto';

/**
 * Generate a random string
 * @param length The length of the generated string
 * @returns The generated string
 */
export default (length: number) => {
  const generated = randomBytes(length / 2).toString('hex');
  return generated;
};
