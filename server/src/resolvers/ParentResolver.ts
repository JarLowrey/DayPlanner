import { Resolver, ClassType, Arg, Query, Int, Ctx, Mutation, ArgsType, Field, Args, InputType } from "type-graphql";
import { BaseEntity, Between, Equal, Like } from "typeorm";
import { startOfDay, endOfDay } from 'date-fns';
import { MinLength, MaxLength } from "class-validator";
import { ENTITY_ID_LENGTH, ParentEntity } from "@models/ParentEntity";


@ArgsType()
export class GetOneArgs {
  @Field()
  @MaxLength(ENTITY_ID_LENGTH)
  @MinLength(ENTITY_ID_LENGTH)
  id: string;
}

export function createParentEntityResolver<T extends ParentEntity>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(type => objectTypeCls, { name: `get${suffix}` })
    async get(@Args() args: GetOneArgs, @Ctx() ctx: any): Promise<T> {
      let beCastedObj = (<typeof ParentEntity>(objectTypeCls as any));
      let entity = await beCastedObj.findOne({ where: args }) as any;
      this.checkCanView(ctx, entity);
      return entity;
    }

    async add(args: any, ctx: any): Promise<T> {
      let beCastedObj = (<typeof ParentEntity>(objectTypeCls as any));
      args.obj.userCreatorId = ctx.req.session.userId;
      this.checkCanEdit(ctx, args.obj);
      let entity = await beCastedObj.create(args.obj) as any;
      await entity.save();
      return entity as any;
    }

    @Mutation(type => String, { name: `delete${suffix}` })
    async delete(@Args() args: GetOneArgs, @Ctx() ctx: any): Promise<string> {
      let beCastedObj = (<typeof ParentEntity>(objectTypeCls as any));
      let existingEntity = await beCastedObj.findOne({where:{id:args.id}});
      this.checkCanEdit(ctx, existingEntity);
      await existingEntity?.remove();
      return args.id;
    }

    async update(args: any, ctx: any): Promise<T> {
      let beCastedObj = (<typeof ParentEntity>(objectTypeCls as any));
      let existingEntity = await beCastedObj.findOne({where:{id:args.existingObjId}});
      this.checkCanEdit(ctx, existingEntity);
      Object.assign(existingEntity, args.obj);
      await existingEntity?.save();
      return existingEntity as any;
    }

    checkCanEdit(ctx: any, obj: any) {
      this.checkCanEditOrView(ctx, obj);
    }
    checkCanView(ctx: any, obj: any) {
      this.checkCanEditOrView(ctx, obj);
    }
    checkCanEditOrView(ctx: any, obj: any) {
      if (!obj) throw new Error("Object not found");
    }

    checkForLogin(ctx: any) {
      let uId = ctx.req.session.userId;
      if (!uId) throw new Error("User not logged in");
    }
  }

  return BaseResolver;
}