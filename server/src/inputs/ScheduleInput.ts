import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { MaxLength, ValidateNested, IsArray, IsNotEmpty, Max, Min, IsInt } from 'class-validator';
import { ObjectType, Field, Int, InputType } from "type-graphql";
import { Activity } from "@models/Activity";

@InputType()
export class ScheduleInput {
    @Field()
    date: Date;

    @ValidateNested({ each: true })
    @IsArray()
    public items?: Activity[];
}
