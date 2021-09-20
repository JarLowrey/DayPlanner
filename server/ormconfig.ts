const fs = require('fs');
const dotenvRes = require('dotenv').config({ path: './src/.env.' + process.env.NODE_ENV });

export = {
   "type": "postgres",
   "host": process.env.DB_HOST,
   "port": parseInt(process.env.DB_PORT as string),
   "username": process.env.DB_USER,
   "password": process.env.DB_PASS,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": true,
   "entities": ["./src/models/*.ts"],
   "migrations": [
      "./src/migration/**/*.ts"
   ],
   "subscribers": [
      "./src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "./src/models",
      "migrationsDir": "./src/migration",
      "subscribersDir": "./src/subscriber"
   },
   "seeds": ["./src/seeds/**/*{.ts,.js}"],
   "factories": ["./src/factories/**/*{.ts,.js}"]
};
