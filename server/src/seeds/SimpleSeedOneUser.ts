import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Activity } from "@models/Activity";
import { Schedule } from "@models/Schedule";
import { User } from "@models/User";

export default class SimpleSeedOneUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await this.addUserAndUserData(factory, "test@example.com", "helloBUDDY1@");
    // await this.addUserAndUserData(factory, "test1@example.com", "helloBUDDY1@1");
    // await this.addUserAndUserData(factory, "test2@example.com", "helloBUDDY1@2");
  }
  async addUserAndUserData(factory: Factory, email: string, pass: string) {
    let user = await factory(User)({ email: email, password: pass }).create();

    let schedules = await factory(Schedule)({ user: user }).createMany(2);
    for(let sch of schedules) await this.assignItems(factory, sch, user);

  }
  async assignItems(factory: Factory, sch: Schedule, user: any) {
    sch.items = await factory(Activity)({ schedule: sch, user: user }).createMany(5) as any;
  }
}