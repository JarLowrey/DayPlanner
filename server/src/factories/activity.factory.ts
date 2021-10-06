import * as Faker from "faker";
import { define, factory } from "typeorm-seeding";
import { User } from "@models/User";
import { Activity } from "@models/Activity";

define(Activity, (faker: typeof Faker, context?: any) => {
    const schItem = new Activity();
    schItem.userCreatorId = context?.user?.id;
    schItem.scheduleId = context?.schedule?.id;
    let startHr = faker.random.number({'min': 0,'max': 23});
    schItem.startingTime = startHr+ ":00:00";
    schItem.endingTime = startHr + ":30:00";
    schItem.descr = faker.lorem.word();
    schItem.completedWith = faker.name.firstName() + " " + faker.name.lastName();
    schItem.satisfaction = faker.random.number({
        'min': Activity.MinEffectiveness,
        'max': Activity.MaxEffectiveness
    });
    return schItem;
})