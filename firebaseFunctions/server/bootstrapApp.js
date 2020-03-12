import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import formData from 'express-form-data';

// Helpers
import { setAppResponse, AppResponse } from './helpers/AppResponse';

// appRoutes
import appRoutes from './routes';

export const bootstrapApp = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.use(setAppResponse);
  app.enable('trust proxy');
  app.use(formData.parse());

  app.use('/api/v1', appRoutes);

  app.use('/*', (req, res) =>
    AppResponse.notFound(res, { message: 'This endpoint does not exist' }),
  );

  return app;
};
