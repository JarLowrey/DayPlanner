const fs = require("fs");
const dotenvRes = require("dotenv").config({
  path: "./.env." + process.env.NODE_ENV,
});
const listenPort = 4000;
//http://localhost:4000/graphql

import "reflect-metadata";
import {
  createConnection,
  Connection,
  ConnectionOptions,
  getConnection,
  getConnectionManager,
} from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, BuildSchemaOptions } from "type-graphql";
import express from "express";
import { session as SessionModel } from "@models/session";
var session = require("express-session");
var { graphqlHTTP } = require("express-graphql");

import { UserResolver } from "@resolvers/UserResolver";
import { User } from "@models/User";
import { UserCreatedEntity } from "@models/UserCreatedEntity";
import { ParentEntity } from "@models/ParentEntity";
import { Activity } from "@models/Activity";
import { Schedule } from "@models/Schedule";

export const implementedUserCreatedEntityModels = [
  nameofModel(Schedule),
  nameofModel(Activity),
];
export const abstractModelNames = [
  nameofModel(ParentEntity),
  nameofModel(UserCreatedEntity),
];
export const serverOnlyModelNames = [nameofModel(SessionModel)];
export const topLevelModelNames = [nameofModel(User)];

const ormconfig = require("@ormconfig");

async function getResolvers() {
  let resolvers = [] as any;
  let addRes = async (models: Array<string>) => {
    for (let model of models) {
      let res = (await import("@resolvers/" + model + "Resolver.ts"))[
        `${model}Resolver`
      ];
      resolvers.push(res);
    }
  };
  await addRes(implementedUserCreatedEntityModels);
  await addRes(topLevelModelNames);
  return resolvers;
}
export async function createServer() {
  let connection; 
  try {
    connection = await createConnection(ormconfig as ConnectionOptions);
  } catch (err) {
    // If AlreadyHasActiveConnectionError occurs, return already existent connection
    if ((err as any).name === "AlreadyHasActiveConnectionError") {
      connection = getConnectionManager().get("default");
    }
  }

  let resolvers = await getResolvers();
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
  });
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => ({ req, res }),
    playground: {
      settings: {
        "request.credentials": "same-origin",
      },
    },
  });
  var app = express();

  var pgSession = require("connect-pg-simple")(session);
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET?.split(","),
      cookie: {
        store: new pgSession({
          pgPromise: connection,
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV == "prod",
        sameSite: true,
        maxAge: 600000, // Time is in miliseconds
      },
      resave: false,
    })
  );

  server.applyMiddleware({ 
    app,
    cors:{ // https://stackoverflow.com/a/60679615/4180797
      origin: process.env.CLIENT_URL,
      credentials:true,  
    }, 
  });

  return app;
}

async function startServer() {
  let app = await createServer();
  await app.listen({ port: listenPort });
  console.log("Server has started!");
}

if (process.env.NODE_ENV === "dev") startServer();

// how to view DB::::::::::::::;
// create db: https://stackoverflow.com/a/26721992
// sudo -u postgres psql
// \c DayPlanner
// \dt (view all tables)
// select date from "dysfunctional_thought";

export function nameofModel(modelClass:any){
  return modelClass.prototype.constructor.name;
}