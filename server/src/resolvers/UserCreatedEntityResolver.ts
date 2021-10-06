import { Resolver, ClassType, Arg, Query, Int, Ctx, Mutation, ArgsType, Field, Args, InputType } from "type-graphql";
import { ParentEntity, ENTITY_ID_LENGTH } from "@models/ParentEntity";
import { BaseEntity, Between, Equal, Like } from "typeorm";
import { UserCreatedEntity } from "@models/UserCreatedEntity";
import { startOfDay, endOfDay } from 'date-fns';
import { MinLength, MaxLength } from "class-validator";
import { createParentEntityResolver, GetOneArgs } from "./ParentResolver";

export function createBaseUserCreatedEntityResolver<T extends UserCreatedEntity>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseUceResolver extends createParentEntityResolver(suffix,objectTypeCls) {
    @Query(type => objectTypeCls, { name: `get${suffix}` })
    async get(@Args() args: GetOneArgs, @Ctx() ctx: any): Promise<T> {
      this.checkForLogin(ctx);
      args = Object.assign(args, { userCreatorId: ctx.req.session.userId })
      return super.get(args,ctx);
    }

    async add(args: any, ctx: any): Promise<T> {
      this.checkForLogin(ctx);
      args.obj.userCreatorId = ctx.req.session.userId;
      return super.add(args,ctx);
    }

    @Mutation(type => String, { name: `delete${suffix}` })
    async delete(@Args() args: GetOneArgs, @Ctx() ctx: any): Promise<string> {
      this.checkForLogin(ctx);
      return super.delete(args,ctx);
    }

    async update(args: any, ctx: any): Promise<T> {
      this.checkForLogin(ctx);
      return super.update(args,ctx);
    }

    checkCanEditOrView(ctx: any, obj: any) {
      super.checkCanEditOrView(ctx,obj);
      let uId = ctx.req.session.userId;
      this.checkForLogin(ctx);
      if (uId != obj.userCreatorId) throw new Error("User does not have permission");
    }
  }

  return BaseUceResolver;
}