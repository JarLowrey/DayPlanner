import { Resolver, Query, Mutation, Arg, ArgsType, Ctx, Field, Int, Args } from "type-graphql";
import { Schedule } from "@models/Schedule";
import { createBaseUserCreatedEntityResolver } from '@resolvers/UserCreatedEntityResolver';
import { ENTITY_ID_LENGTH, ParentEntity } from "@models/ParentEntity";
import { ValidateNested, MaxLength, MinLength } from 'class-validator';
import { ScheduleInput } from "@inputs//ScheduleInput";

const BaseResolver = createBaseUserCreatedEntityResolver("Schedule", Schedule as any);

@ArgsType()
class UpdateArgs {
  @Field()
  @MaxLength(ENTITY_ID_LENGTH)
  @MinLength(ENTITY_ID_LENGTH)
  existingObjId: string;

  @Field()
  @ValidateNested()
  obj: ScheduleInput;
}
@ArgsType()
class AddArgs {
  @Field()
  @ValidateNested()
  obj: ScheduleInput;
}

@Resolver(of => Schedule)
export class ScheduleResolver extends BaseResolver {
  // relations = ["userCreator","items"];

  @Mutation(() => Schedule)
  async addDailyActivitySchedule(@Args() args: AddArgs, @Ctx() ctx: any) {
    return super.add(args, ctx);
  }

  @Mutation(() => Schedule)
  async updateDailyActivitySchedule(@Args() args: UpdateArgs, @Ctx() ctx: any) {
    return super.update(args, ctx);
  }
}
