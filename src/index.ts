import { createServer } from './server.js';
import { env } from './utils/env.js';
import { connectMongo } from './utils/mongo.js';

const port = Number(env.PORT) || 4000;

async function main() {
  await connectMongo();
  const app = createServer();
  app.listen(port, () => {
    console.log(`FORMOTEX (Mongo) API running on http://localhost:${port}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
