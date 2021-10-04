/* __tests__/queries.js */
import {
  createServer as createMyAppServer,
  implementedUserCreatedEntityModels,
} from "@index";
import supertest from "supertest";
import * as http from "http";
import { ENTITY_ID_LENGTH } from "@models/ParentEntity";
import { factory, tearDownDatabase, useSeeding } from "typeorm-seeding";
var assert = require("chai").assert;
import {
  reqSender,
  TEST_VALID_LOGIN_GQL,
  convertJsonToGqlDataString,
  // KeysToEnum,
} from "../util/testing";
import { Schedule } from "@models/Schedule";
import { getConnection, getManager } from "typeorm";
import { isEqual } from "date-fns";
import { Activity } from "@models/Activity";
import { nameofModel } from "@index";

export const requiredParents = {
  [nameofModel(Activity)]: {
    prop: "scheduleId",
    classType: "Activity",
  },
} as any;

export async function getAllQuery(modelName: string, getAllKeys = false) {
  let returnKeys = getAllKeys
    ? (await getOrmColumnNames(modelName)).join(",")
    : "id";

  return `
      query { 
        getAll${modelName} { ${returnKeys} } 
      }`;
}
async function getOrmColumnNames(modelName: any) {
  let model = await getModelClass(modelName);
  return getConnection()
    .getMetadata(model)
    .ownColumns.map((column) => column.propertyName);
}
function getOneQuery(modelName: string, id: string) {
  return `
      query { 
        get${modelName}(id: "${id}") {
           id 
        } 
      }`;
}
function createQuery(modelName: string, data: any) {
  return `
        mutation {
            add${modelName}( obj: ${convertJsonToGqlDataString(data)} ){
                id
            }
        }
      `;
}
function deleteQuery(modelName: string, id: any) {
  return `
        mutation {
            delete${modelName}( id: "${id}" ) 
        }
      `;
}
async function updateQuery(
  modelName: string,
  id: string,
  obj: any,
  getAllKeys = false
) {
  let returnKeys = getAllKeys
    ? (await getOrmColumnNames(modelName)).join(",")
    : "id";
  return `
        mutation {
            update${modelName}( existingObjId: "${id}", obj: ${convertJsonToGqlDataString(
    obj
  )}) { ${returnKeys} }
        }
      `;
}
let requestServer: any;
let sendReq: any;

describe("tests", function () {
  before(async function () {
    requestServer = supertest(http.createServer(await createMyAppServer()));
    sendReq = reqSender(requestServer);
    await useSeeding(); //must be called to use typeorm seeding
  });

  after(async function () {
    await tearDownDatabase(); //must be called to use typeorm seeding
  });

  describe("login and logout", function () {
    it("test all login and logout sequences", async function () {
      let resp;
      resp = await sendReq(TEST_VALID_LOGIN_GQL);
      assert.equal(resp.text.data.login.toLowerCase().length, ENTITY_ID_LENGTH);
      let firstCookie = resp.cookie;

      resp = await sendReq(
        TEST_VALID_LOGIN_GQL, //login
        firstCookie
      );
      assert.equal(resp.text.data.login.toLowerCase().includes("err:"), true);

      resp = await sendReq(
        TEST_VALID_LOGIN_GQL, //login twice
        firstCookie
      );
      assert.equal(resp.text.data.login.toLowerCase().includes("err:"), true);

      resp = await sendReq("mutation {logout}", firstCookie);
      assert.equal(resp.text.data.logout.toLowerCase().includes("err:"), false); //logout

      resp = await sendReq("mutation {logout}", firstCookie);
      assert.equal(resp.text.data.logout.toLowerCase().includes("err:"), true); //logout twice

      resp = await sendReq(TEST_VALID_LOGIN_GQL, firstCookie);
      assert.equal(resp.text.data.login.toLowerCase().includes("err:"), false); //login after logging out, using original cookie (this is ok cuz it was logged out)

      resp = await sendReq(
        'mutation {login(email:"teasdasdasdasdst@example.com",password:"helloBUDDY1@")}', //login email doesnt exist
        firstCookie
      );
      assert.equal(resp.text.data.login.toLowerCase().includes("err:"), true);
    });
  });

  describe("user created entity: get all and get one tests", function () {
    it("get all with login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let getAllResp = await sendReq(
          await getAllQuery(x),
          loginRes.cookie,
          200,
          true
        );
        assert.isAbove(getAllResp.text.data[`getAll${x}`].length, 0);
      }
      logout(loginRes.cookie);
    });
    it("get one with login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x, loginRes);
        let getOneResp = await sendReq(
          getOneQuery(x, item.id),
          loginRes.cookie
        );

        assert.equal(getOneResp.text.data[`get${x}`].id, item.id);
      }
      logout(loginRes.cookie);
    });

    it("get all without login", async function () {
      for (const x of implementedUserCreatedEntityModels) {
        let resp = await sendReq(await getAllQuery(x), []);
        assert.equal(resp.text.errors[0].message, "User not logged in");
      }
    });

    it("get one without login", async function () {
      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x);
        let resp = await sendReq(getOneQuery(x, item.id));
        assert.equal(resp.text.errors[0].message, "User not logged in");
      }
    });
  });

  describe("user created entity: create tests", function () {
    it("add user-created-entity with login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let model = await getModelClass(x);
        let newEntity = (await factory(model)().make()) as any;

        let keys = Object.keys(requiredParents);
        if (keys.includes(x)) {
          newEntity = await addParent(x, loginRes, newEntity);
        }
        setGqlEnums(newEntity);

        let addResp = await sendReq(createQuery(x, newEntity), loginRes.cookie);
        assert.equal(addResp.text.data[`add${x}`].id.length, ENTITY_ID_LENGTH);
      }
      logout(loginRes.cookie);
    });

    it("user created entity: add user-created-entity without login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let model = await getModelClass(x);
        let newEntity = (await factory(model)().make()) as any;

        if (Object.keys(requiredParents).includes(x)) {
          newEntity = await addParent(x, loginRes, newEntity);
        }
        setGqlEnums(newEntity);

        let addResp = await sendReq(createQuery(x, newEntity));
        assert.equal(addResp.text.errors[0].message, "User not logged in");
      }
      logout(loginRes.cookie);
    });

    it("user created entity: add user without parent", async function () {
      let loginRes = await login();

      for (const x of Object.keys(requiredParents)) {
        let model = await getModelClass(x);
        let newEntity = (await factory(model)().make()) as any;

        setGqlEnums(newEntity);

        let addResp = await sendReq(createQuery(x, newEntity), loginRes.cookie);
        assert.equal(true, addResp.text.errors[0].message.toLowerCase().includes("missing"));
      }
      logout(loginRes.cookie);
    });
  });

  describe("user created entity: delete tests", function () {
    it("delete user-created-entity with login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x, loginRes);
        let deleteResp = await sendReq(
          deleteQuery(x, item.id),
          loginRes.cookie
        );
        assert.equal(deleteResp.text.data[`delete${x}`], item.id);
      }
      logout(loginRes.cookie);
    });

    it("delete user-created-entity without login", async function () {
      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x);
        let deleteResp = await sendReq(deleteQuery(x, item.id));
        assert.equal(deleteResp.text.errors[0].message, "User not logged in");
      }
    });
  });

  describe("user created entity: update tests", function () {
    it("try to update forbidden props", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x, loginRes);
        let model = await getModelClass(x);
        let newItem = (await factory(model)().make()) as any;

        if (Object.keys(requiredParents).includes(x)) {
          newItem = await addParent(x, loginRes, newItem);
        }
        setGqlEnums(newItem);

        newItem.id = item.id;
        let updateResp = await sendReq(
          await updateQuery(x, item.id, newItem),
          loginRes.cookie,
          400
        ); //req will fail, it includes id in item
        delete newItem.id;

        newItem.userCreator = { id: item.userCreatorId };
        updateResp = await sendReq(
          await updateQuery(x, item.id, newItem),
          loginRes.cookie,
          400
        ); //will fail, cannot set userCreator
        item = await getEntity(x, item.id);
        assert.equal(item.userCreatorId, loginRes.uId);
        delete newItem.userCreator;

        newItem.userCreatorId = item.userCreatorId;
        updateResp = await sendReq(
          await updateQuery(x, item.id, newItem),
          loginRes.cookie,
          400
        ); //will fail, cannot set userCreator
        item = await getEntity(x, item.id);
        assert.equal(item.userCreatorId, loginRes.uId);
        delete newItem.userCreatorId;

        let originalCreatedAt = item.createdAt;
        newItem.createdAt = new Date().toISOString();
        updateResp = await sendReq(
          await updateQuery(x, item.id, newItem),
          loginRes.cookie,
          400
        ); //will fail, cannot set created at
        item = await getEntity(x, item.id);
        assert.equal(
          true,
          isEqual(new Date(originalCreatedAt), new Date(item.createdAt))
        );
        delete newItem.createdAt;

        let originalUpdatedAt = item.updatedAt;
        newItem.updatedAt = new Date().toISOString();
        updateResp = await sendReq(
          await updateQuery(x, item.id, newItem),
          loginRes.cookie,
          400
        ); //will fail, cannot set updated at
        item = await getEntity(x, item.id);
        assert.equal(
          true,
          isEqual(new Date(originalUpdatedAt), new Date(item.updatedAt))
        );
        delete newItem.updatedAt;
      }
      logout(loginRes.cookie);
    });

    it("update user created entity with login", async function () {
      let loginRes = await login();

      for (const x of implementedUserCreatedEntityModels) {
        let item = await getAnyEntity(x, loginRes);
        let originalId = item.id;
        let model = await getModelClass(x);
        let newItem = (await factory(model)().make()) as any;
        const fakeParentId = "asdf";

        if (Object.keys(requiredParents).includes(x)) {
          let parentIdKey = requiredParents[x]["prop"];
          newItem[parentIdKey] = fakeParentId;
        }
        setGqlEnums(newItem);

        delete newItem.userCreator;
        delete newItem.userCreatorId;
        delete newItem.createdAt;
        delete newItem.updatedAt;
        delete newItem.id;

        let updateResp = await sendReq(
          await updateQuery(x, originalId, newItem),
          loginRes.cookie
        );


        //ensure that the parent id was not, and cannot, be updated here
        if (Object.keys(requiredParents).includes(x)) {
          let item = await getEntity(x, originalId);
          let parentIdKey = requiredParents[x]["prop"];
          assert.notEqual(item[parentIdKey], fakeParentId);
        }
      }
      logout(loginRes.cookie);
    });

  });
});

// function randomlyModifyEntity(entity: any) {
//   let keys = Object.keys(entity);
//   for (let key of keys) {
//     let val = entity[key];
//     let dateVal = new Date(val);
//     if (key.slice(-2) != "Id" && key!="id" ) {
//       if (typeof val == 'number') val = 99;
//       else if (typeof val === 'boolean') val = !val;
//       else if (!isNaN(dateVal.getDate())) val = new Date().toISOString();
//       else if (typeof val == 'string') val = "asd";
//       entity[key] = val;
//     }
//   }
//   return entity;
// }

function setGqlEnums(entity: any) {
  // let enumProps = Object.keys(KeysToEnum) as any;
  // for (let key of Object.keys(entity)) {
  //   if (enumProps.includes(key)) {
  //     let vals = Object.keys((KeysToEnum as any)[key]);
  //     entity[key] = vals[0];
  //   }
  // }
}

async function addParent(x: string, loginRes: any, newEntity: any) {
  let parent = requiredParents[x].classType;
  let item = await getAnyEntity(parent, loginRes);
  let parentIdKey = requiredParents[x]["prop"];
  newEntity[parentIdKey] = item.id;
  return newEntity;
}


async function login() {
  let resp;
  resp = await sendReq(TEST_VALID_LOGIN_GQL);
  assert.equal(resp.text.data.login.toLowerCase().length, ENTITY_ID_LENGTH);
  return { cookie: resp.cookie, uId: resp.text.data.login };
}

async function logout(loginCookie: any) {
  await sendReq("mutation {logout}", loginCookie);
}
async function getModelClass(classname: string) {
  return (await import("@models/" + classname + ".ts"))[classname];
}

async function getAnyEntity(className: string, loginRes: any = null) {
  let model = await getModelClass(className);
  let options = loginRes ? { where: { userCreatorId: loginRes.uId } } : {};
  let entity = (await model.findOne(options)) as any;
  return entity;
}

async function getEntity(className: string, id: string) {
  let model = await getModelClass(className);
  let entity = (await model.findOne(id)) as any;
  return entity;
}
