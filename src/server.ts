
import app from './app';
import config from './config';

const port = config.port;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export default app;

