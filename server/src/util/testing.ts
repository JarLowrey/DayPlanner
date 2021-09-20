import {
  createServer as createMyAppServer,
  implementedUserCreatedEntityModels,
} from "@index";
import supertest from "supertest";
import * as http from "http";
import { ENTITY_ID_LENGTH } from "@models/ParentEntity";
import { factory, tearDownDatabase, useSeeding } from "typeorm-seeding";
import { CognitiveDistortion } from "@models/DysfunctionalThought";
import { EmotionPlacement } from "@models/EmotionResponse";
import { ProConStringType } from "@models/ProConStr";
var assert = require("chai").assert;

export const TEST_VALID_LOGIN_GQL =
  'mutation {login(email:"test@example.com",password:"helloBUDDY1@")}';
export const TEST_PORT = 8980;

export const KeysToEnum = {
  distortion: CognitiveDistortion,
  emotionPlacement: EmotionPlacement,
  proConStringType: ProConStringType,
}

export function convertJsonToGqlDataString(data: any) {
  let resp = "{";
  for (let key of Object.keys(data)) {
    if (data[key] != undefined) {
      if (Object.keys(KeysToEnum).includes(key)) resp += `${key}: ${data[key]},`;
      else resp += `${key}: ${JSON.stringify(data[key])},`;
    }
  }
  resp = resp.slice(0, -1); //remove last comma
  resp += "}";
  return resp;
}

export function reqSender(requestServer: any) {
  return async function sendReq(
    gql: string,
    prevCookie: any = [],
    expectedStatus = 200,
    logErr = false
  ) {
    let fullResp: any;
    let cookie: any;

    try {
      let resp = await requestServer
        .post("/graphql")
        .send({
          query: gql,
        })
        .set("Accept", "application/json")
        .set("cookie", prevCookie)
        .set("Content-Type", "application/json")
        .then((resolver: any, rejector: any) => {
          if (rejector) throw rejector;
          fullResp = resolver.res as any;
          cookie = fullResp.headers["set-cookie"];

          try {
            assert.equal(
              fullResp.headers["content-type"].includes("application/json"),
              true
            );
            assert.equal(fullResp.statusCode, expectedStatus);
          } catch (e) {
            console.error(fullResp.text);
            throw e;
          }
        });
    } catch (e) {
      console.error("request= " + gql);
      console.error(e);
      throw e;
    }
    let errs = JSON.parse(fullResp.text).errors;
    if (errs && logErr) console.error(errs);
    return { cookie, fullResp, text: JSON.parse(fullResp.text) };
  };
}
