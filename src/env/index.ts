import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '.env' });

const envSchema = z.object({
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('ERRO NAS VARIÁVEIS', _env.error.format());
  throw new Error('ERRO');
}

export const env = _env.data;
