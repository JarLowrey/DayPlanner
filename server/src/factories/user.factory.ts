import { User } from "@models/User"
import * as Faker from "faker";
import { define } from "typeorm-seeding";

define(User, (faker: typeof Faker, context?: any) => {
    const gender = faker.random.number(1)

    const user = new User();
    user.name = faker.name.firstName(gender);
    user.email = context?.email || faker.internet.email();
    user.password = context?.password || (faker.internet.password() + "@");
    return user
})