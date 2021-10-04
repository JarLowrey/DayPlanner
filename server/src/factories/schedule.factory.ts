import * as Faker from "faker";
import { define, factory } from "typeorm-seeding";
import { Schedule } from "@models/Schedule";
import addDays from 'date-fns/addDays';

define(Schedule, (faker: typeof Faker, context?: any) => {
    const sch = new Schedule();
    sch.userCreatorId = context?.user?.id;
    sch.date = context?.date || faker.date.past();

    return sch;
})