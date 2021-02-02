export default class {
  constructor(
    private config: Config,
    private options?: Options,
  ) {
    process.env.PORT = config.port?.toString() || '3000';
    process.env.API_URL = config.apiURL || `http://localhost:${process.env.PORT}/api`;
    process.env.BOT_ID = config.botId;
    process.env.BOT_TOKEN = config.botToken;
    process.env.CLIENT_SECRET = config.clientSecret;
    process.env.DASHBOARD_URL = config.dashboardURL || `http://localhost:${process.env.PORT}`;
    process.env.MONGO_URI = config.mongoURI || 'mongodb://localhost/2PG';

    this.options = {
      ...options
    };
  }

  /** Start the app, using the specific options. */
  async init() {
    await import('./bot');
  }
}

interface Config {
  apiURL?: string;
  botId: string;
  botToken: string;
  clientSecret: string;
  dashboardURL?: string;
  mongoURI?: string;
  port?: number;
}

interface Options {  
}

/**
 * API_URL="http://localhost:3000/api"
BOT_ID=""
BOT_TOKEN=""
CLIENT_SECRET=""
DASHBOARD_URL="http://localhost:4200"
DBOTS_AUTH=""
FEEDBACK_CHANNEL_ID=""
GUILD_ID=""
OWNER_ID=""
MONGO_URI="mongodb://localhost/2PG"
PORT="3000"
PREMIUM_ROLE_ID=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
TOP_GG_AUTH=""
VOTE_CHANNEL_ID="788001309197860874"
 */
