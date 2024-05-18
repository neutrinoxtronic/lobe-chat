import { Pool, neonConfig } from '@neondatabase/serverless';
import { NeonDatabase, drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import { getServerConfig } from '@/config/server';
import { isServerMode } from '@/const/version';

import * as schema from '../schemas/lobechat';

const getDBInstance = (): NeonDatabase<typeof schema> => {
  if (!isServerMode) return {} as any;

  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    // https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined
    neonConfig.webSocketConstructor = ws;
  }

  const { DATABASE_URL, DATABASE_TEST_URL } = getServerConfig();

  const connectionString = isTest ? DATABASE_TEST_URL : DATABASE_URL;

  if (!connectionString) {
    const string = isTest ? 'DATABASE_TEST_URL' : 'DATABASE_URL';
    throw new Error(`You are try to use database, but "${string}" is not set correctly`);
  }
  // const client = neon(connectionString);
  const client = new Pool({ connectionString });

  return drizzle(client, { schema });
};

export const serverDB = getDBInstance();
