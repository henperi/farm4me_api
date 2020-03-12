import * as functions from 'firebase-functions';

import { server } from './server';

export const cloud = functions.https.onRequest(server);
