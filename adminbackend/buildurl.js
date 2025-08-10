
const fs =require('fs');
const path =require('path');
const dotenv =require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');

const envConfig = dotenv.config({ path: envPath });

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME) {
  console.error(' Missing one or more required DB environment variables.');
  process.exit(1);
}

const databaseUrl = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:5432/${DB_NAME}?schema=public`;

let envContent = fs.readFileSync(envPath, 'utf-8');

if (envContent.includes('DATABASE_URL=')) {
  envContent = envContent.replace(/^DATABASE_URL=.*/m, `DATABASE_URL=${databaseUrl}`);
} else {
  envContent += `\nDATABASE_URL=${databaseUrl}\n`;
}

fs.writeFileSync(envPath, envContent, 'utf-8');
console.log(' DATABASE_URL has been set in .env');
