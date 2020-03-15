import * as functions from 'firebase-functions';

import { server } from './server';

export const cloud = functions.runWith({ memory: '1GB', timeoutSeconds: 120 }).https.onRequest(server);
