import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
dotenv.config();
const storage = new Storage({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    universe_domain: process.env.UNIVERSAL_DOMAIN,
  },
});
export default storage;