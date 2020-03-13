import * as functions from 'firebase-functions';

const { farm4me } = functions.config();

export const config = {
  JWT_SECRET: farm4me.jwt_secret,
};
