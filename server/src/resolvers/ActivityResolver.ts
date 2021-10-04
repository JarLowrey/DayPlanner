import { Resolver, Query, Mutation, Arg, ArgsType, Ctx, Field, Int, Args } from "type-graphql";
import { Activity } from "@models/Activity";
import { createBaseUserCreatedEntityResolver } from '@resolvers/UserCreatedEntityResolver';
import { ENTITY_ID_LENGTH } from "@models/ParentEntity";
import { ValidateNested, MaxLength,MinLength } from 'class-validator';
import { ActivityInput } from "@inputs//ActivityInput";

const BaseResolver = createBaseUserCreatedEntityResolver("Activity", Activity as any);

@ArgsType()
class UpdateArgs {
    @Field()
    @MaxLength(ENTITY_ID_LENGTH)
    @MinLength(ENTITY_ID_LENGTH)
    existingObjId: string;

    @Field()
    @ValidateNested()
    obj: ActivityInput;
}
@ArgsType()
class AddArgs {
    @Field()
    @ValidateNested()
    obj: ActivityInput;
}

@Resolver(of => Activity)
export class ActivityResolver extends BaseResolver {
    // relations = ["userCreator", "schedule", "schedule.userCreator"];

    @Mutation(() => Activity)
    async addActivity(@Args() args: AddArgs, @Ctx() ctx: any) {
        if(!args.obj.scheduleId) throw new Error("Missing schedule id");
        return super.add(args, ctx);
    }

    @Mutation(() => Activity)
    async updateActivity(@Args() args: UpdateArgs, @Ctx() ctx: any) {
        delete args.obj.scheduleId;
        return super.update(args, ctx);
    }
}
