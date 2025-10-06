import 'dotenv/config';
import { configuration } from './config/configuration.js';
import { ConfigurationSchema } from './config/configuration.schema.js';
import { AstralService } from './services/astral-service.js';

/**
 * Main entry point.
 * This function validates the app configuration and draws the objects
 * present in the goal payload.
 */
const main = async () => {
  ConfigurationSchema.parse(configuration);

  const astralService = new AstralService();
  await astralService.draw();
};

main().catch((err) => {
  console.error('An error happened:', err);
  process.exit(1);
});
