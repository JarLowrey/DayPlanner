import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
  Field,
  Ctx,
  ArgsType,
} from "type-graphql";
import { User } from "@models/User";
import {
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { createParentEntityResolver } from "./ParentResolver";
import { UserInput } from "@inputs/UserInput";
import { encrypt, genKey } from "util/encrypt";
import { ENTITY_ID_LENGTH } from "@models/ParentEntity";

var bcrypt = require("bcryptjs");

@ArgsType()
export class UserLoginArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Matches(/.*\d.*/)
  @Matches(/.*[a-z].*/)
  @Matches(/.*[A-Z].*/)
  @Matches(/.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~].*/)
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

@ArgsType()
class UpdateArgs {
  @Field()
  @MaxLength(ENTITY_ID_LENGTH)
  @MinLength(ENTITY_ID_LENGTH)
  existingObjId: string;

  @Field()
  @ValidateNested()
  obj: UserInput;
}
@ArgsType()
class AddArgs {
  @Field()
  @ValidateNested()
  obj: UserInput;
}

@Resolver()
export class UserResolver extends createParentEntityResolver(
  "User",
  User as any
) {
  checkCanEditOrView(ctx: any, obj: any) {
    super.checkCanEditOrView(ctx, obj);
    this.checkForLogin(ctx);
    let uId = ctx.req.session.userId;
    if (uId != obj.id) throw new Error("User not authorized to access user");
  }

  @Mutation(() => User)
  async addUser(@Args() args: AddArgs, @Ctx() ctx: any) {
    this.checkForLogin(ctx);

    args.obj.encryptionKey = encrypt(genKey(), args.obj.password);

    return super.add(args, ctx);
  }

  @Mutation(() => User)
  async updateUser(@Args() args: UpdateArgs, @Ctx() ctx: any) {
    this.checkForLogin(ctx);
    return super.update(args, ctx);
  }

  @Mutation(() => String)
  async login(@Args() { email, password }: UserLoginArgs, @Ctx() ctx: any) {
    let response = "";
    let sess = ctx.req.session;
    if (sess.userId) {
      response = "ERR: already logged in";
    } else {
      let user = await User.findOne({ where: { email: email } });
      if (user) {
        let passwordsMatch = await bcrypt.compare(password, user?.password);
        if (passwordsMatch) {
          sess.userId = user.id;
          await sess.save();
          response = user.id;
        } else {
          response = "ERR: Password doesn't match";
        }
      } else {
        response = "ERR: User not found";
      }
    }
    return response;
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: any) {
    let sess = ctx.req.session;
    if (!sess.userId) {
      return "ERR: already logged out";
    } else {
      sess.destroy();
      return "logged out";
    }
  }
}
