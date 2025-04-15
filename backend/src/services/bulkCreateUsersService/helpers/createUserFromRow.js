import { hashPassword } from '../../utils/cryptService.js';
import { generateInitialRefreshToken } from '../../utils/tokenService.js';
import { findUserByLogin } from '../findUserService.js';
import { createUserInDB } from '../createUserService.js';

export const createUserFromRow = async (userRow) => {
  const { login, password, spaceId, role } = userRow;

  const existingUser = await findUserByLogin(login);
  if (existingUser) {
    throw new Error('Login já existente.');
  }

  const hashedPassword = await hashPassword(password);
  const refreshToken = generateInitialRefreshToken();

  await createUserInDB(login, hashedPassword, refreshToken, spaceId, role);
};