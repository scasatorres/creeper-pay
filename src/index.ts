import * as https from 'https';
import fs from 'fs';
import { app } from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

// https
//   .createServer(
//     {
//       key: fs.readFileSync(process.env.KEY_PATH),
//       cert: fs.readFileSync(process.env.CERT_PATH),
//     },
//     app,
//   )
//   .listen(port, () => {
//     console.log(`Server is up and running on port ${port}`);
//   });
