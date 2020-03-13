import express from 'express';
import { bootstrapApp } from './bootstrapApp';

const app = express();


export const server = bootstrapApp(app);
