const dotenv = require('dotenv');
const app = require('./app');
const connectMongo = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
