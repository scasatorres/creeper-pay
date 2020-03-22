import https from 'https';
import * as fs from 'fs';
import { app } from './app';

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
  });
} else {
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH),
        ca: fs.readFileSync(process.env.CA_PATH),
      },
      app,
    )
    .listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
}
