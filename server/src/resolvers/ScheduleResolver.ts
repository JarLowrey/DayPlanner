import { Resolver, Query, Mutation, Arg, ArgsType, Ctx, Field, Int, Args } from "type-graphql";
import { Schedule } from "@models/Schedule";
import { createBaseUserCreatedEntityResolver } from '@resolvers/UserCreatedEntityResolver';
import { ENTITY_ID_LENGTH, ParentEntity } from "@models/ParentEntity";
import { ValidateNested, MaxLength, MinLength } from 'class-validator';
import { ScheduleInput } from "@inputs//ScheduleInput";
import { Between } from "typeorm";
import { endOfDay, startOfDay } from "date-fns";

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


@ArgsType()
export class CommonArgs {
  @Field({ nullable: true })
  date: Date;
}

@Resolver(of => Schedule)
export class ScheduleResolver extends BaseResolver {
  // relations = ["userCreator","items"];

  @Query(type => [Schedule])
  async getSchedulesFromDate(@Args() args: CommonArgs, @Ctx() ctx: any): Promise<Schedule> {
    this.checkForLogin(ctx);

    let whereArgs = {} as any;
    if (args.date) whereArgs.date = (Between(startOfDay(args.date).toISOString(), endOfDay(args.date).toISOString()) as any);
    whereArgs.userCreatorId = ctx.req.session.userId;

    let entities =[];
    entities = await Schedule.find( { where: whereArgs, relations: ["items", "userCreator"]},  ) as any;
    entities.forEach((e: any) => {
      this.checkCanView(ctx, e);
    });
    return entities;
  }

  @Mutation(() => Schedule)
  async addSchedule(@Args() args: AddArgs, @Ctx() ctx: any) {
    return super.add(args, ctx);
  }

  @Mutation(() => Schedule)
  async updateSchedule(@Args() args: UpdateArgs, @Ctx() ctx: any) {
    return super.update(args, ctx);
  }
}
