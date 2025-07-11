import { client } from '@/core/bot';

import 'dotenv/config';
import eventHandler from './core/eventHandler';
import { commandHandler } from './core/commandHandler';

eventHandler(client);
commandHandler(client);

client.login(process.env.BOT_TOKEN)