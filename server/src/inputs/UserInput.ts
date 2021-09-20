import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
var bcrypt = require('bcryptjs');
import { IsEmail, Matches, MinLength, MaxLength } from "class-validator";
import { User } from "@models/User";

@InputType()
export class UserInput {
    @Field()
    @MaxLength(User.NameMaxStringLength)
    name: string;

    @Field()
    @IsEmail()
    @MaxLength(User.EmailMaxStringLength)
    email: string;

    @Field()
    @Matches(/.*[a-z].*/)
    @Matches(/.*[A-Z].*/)
    @Matches(/.*\d.*/)
    @Matches(/.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~].*/)
    @MinLength(User.PasswordMinStringLength)
    @MaxLength(User.PasswordMaxStringLength)
    password: string;

    encryptionKey:string;
}
