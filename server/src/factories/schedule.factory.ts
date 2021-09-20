import * as Faker from "faker";
import { define, factory } from "typeorm-seeding";
import { User } from "@models/User";
import { Schedule } from "@models/Schedule";

define(Schedule, (faker: typeof Faker, context?: any) => {
    const sch = new Schedule();
    sch.userCreatorId = context?.user?.id;
    sch.date = faker.date.past();

    return sch;
})