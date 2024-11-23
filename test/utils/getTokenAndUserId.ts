import { authRoutes } from '../endpoints';

const createUserDto = {
  login: 'TEST_AUTH_LOGIN',
  password: 'Tu6!@#%&',
};

const getTokenAndUserId = async (request) => {
  const signupResponse = await request
    .post(authRoutes.signup)
    .set('Accept', 'application/json')
    .send(createUserDto);

  const { id: mockUserId } = signupResponse.body;
  const loginResponse = await request
    .post(authRoutes.login)
    .set('Accept', 'application/json')
    .send(createUserDto);
  const { accessToken } = loginResponse.body;

  if (!accessToken || !mockUserId) {
    throw new Error('Authorization is not implemented');
  }

  const token = `Bearer ${accessToken}`;
  return {
    token,
    mockUserId,
  };
};

export default getTokenAndUserId;
