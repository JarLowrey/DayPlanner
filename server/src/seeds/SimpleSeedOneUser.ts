import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Activity } from "@models/Activity";
import { Schedule } from "@models/Schedule";
import { User } from "@models/User";
import addDays from "date-fns/addDays";

export default class SimpleSeedOneUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await this.addUserAndUserData(factory, "test@example.com", "helloBUDDY1@");
    // await this.addUserAndUserData(factory, "test1@example.com", "helloBUDDY1@1");
    // await this.addUserAndUserData(factory, "test2@example.com", "helloBUDDY1@2");
  }
  async addUserAndUserData(factory: Factory, email: string, pass: string) {
    let user = await factory(User)({ email: email, password: pass }).create();

    for(let i=-5;i<=1;i++){
      let sch = await factory(Schedule)({ user: user,date: addDays(new Date(),i) }).create();
      await this.assignItems(factory, sch, user);  
    }
  }
  async assignItems(factory: Factory, sch: Schedule, user: any) {
    sch.items = await factory(Activity)({ schedule: sch, user: user }).createMany(5) as any;
  }
}