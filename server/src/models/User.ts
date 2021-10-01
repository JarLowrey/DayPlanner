import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { ParentEntity,ENTITY_ID_LENGTH } from "@models/ParentEntity";
import { UserCreatedEntity } from "@models/UserCreatedEntity";
var bcrypt = require('bcryptjs');
import { IsEmail, Matches, MinLength, MaxLength } from "class-validator";
import { LENGTH_STRING_MEDIUM, LENGTH_STRING_SMALL } from "util/encrypt";

@Entity()
@ObjectType({ implements: ParentEntity })
export class User extends ParentEntity {
  static readonly NameMaxStringLength = 100;
  static readonly EmailMaxStringLength = 300;
  @Field()
  @Column({
    type: "varchar",
    length: User.NameMaxStringLength,
  })
  name: string;

  @Field()
  @IsEmail()
  @Column({
    type: "varchar",
    length: User.EmailMaxStringLength,
    unique: true
  })
  email: string;

  static PasswordMinStringLength = 8;
  static PasswordMaxStringLength = 60;// https://www.npmjs.com/package/bcryptjs note: ascii text in JS strings are 1 byte each, just validate that text is ascii
  @Field()
  @Column({
    type: "varchar",
    length: User.PasswordMaxStringLength
  })
  password: string;

  @BeforeInsert()
  async setPassword() {
    let passesAllValidation = this.password.match(/.*\d.*/) != null;
    passesAllValidation = passesAllValidation && this.password.match(/.*[a-z].*/) != null;
    passesAllValidation = passesAllValidation && this.password.match(/.*[A-Z].*/) != null;
    passesAllValidation = passesAllValidation && this.password.match(/.*[ !"#$%&'()*+,-@models/:;<=>?@[\]^_`{|}~].*/) != null;
    passesAllValidation = passesAllValidation && this.password.length >= User.PasswordMinStringLength;
    passesAllValidation = passesAllValidation && this.password.length <= User.PasswordMaxStringLength;
    if (!passesAllValidation) throw new Error('Password must be 8-60 characters long, contain a digit, an uppercase letter, a lowercase letter, and a special character.');
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
