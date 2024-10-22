import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { seederRouter } from '../src/seeder/seederRoutes';
import categoryRoutes from '../src/routes/category';
import configData from '../config/appConfig';
import { userRoutes } from './routes/user';
import fileRoutes  from './routes/file';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use("*", cors());
app.use(logger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/' + configData.app.api_version + '/seed', seederRouter);
app.route('/' + configData.app.api_version + '/categories', categoryRoutes);
app.route('/' + configData.app.api_version + '/users', userRoutes);
app.route('/' + configData.app.api_version + '/files', fileRoutes);

const port = configData.app.port;
console.log(`Server is running on port ${port}`);

app.onError((err: any, c: Context) => {
  c.status(err.status || 500)
  return c.json({
    success: false,
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    errors: err.errData || null
  });
});

serve({
  fetch: app.fetch,
  port
});












// import { serve } from '@hono/node-server';
// import { Context, Hono } from 'hono';
// import { seederRouter } from '../src/seeder/seederRoutes';
// import { fileRoutes } from './routes/file';
// import categoryRoutes from '../src/routes/category'
// import configData from '../config/appConfig';
// import { userRoutes } from './routes/user';
// import { cors } from 'hono/cors';
// import { logger } from 'hono/logger';

// const app = new Hono();

// app.use("*", cors());

// app.use(logger());

// app.get('/', (c) => {
//   return c.text('Hello Hono!');
// });

// app.route('/' + configData.app.api_version +'/seed', seederRouter);
// app.route('/' + configData.app.api_version +'/categories',categoryRoutes)
// app.route('/' + configData.app.api_version + '/files', fileRoutes);
// app.route('/' + configData.app.api_version + '/users', userRoutes);


// const port = configData.app.port;
// console.log(`Server is running on port ${port}`);

// app.onError((err: any, c: Context) => {
//   c.status(err.status || 500)
//   return c.json({
//     success: false,
//     status: err.status || 500,
//     message: err.message || 'Something went wrong',
//     errors: err.errData || null
//   })
// })

// serve({
//   fetch: app.fetch,
//   port
// });
