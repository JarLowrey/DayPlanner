import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { MaxLength, ValidateNested, IsArray, MinLength, Max, Min, IsInt } from 'class-validator';
import { ObjectType, Field, Int, InputType } from "type-graphql";
import { Activity } from "@models/Activity";
import { ENTITY_ID_LENGTH } from '@models/ParentEntity';

@InputType()
export class ActivityInput {
    @Field(() => Int)
    @IsInt()
    @Min(Activity.MinStartingMinute)
    @Max(Activity.MaxStartingMinute)
    startingMinute: number;

    @Field()
    @MaxLength(Activity.DescrMaxStringLength)
    prospectiveTask: string;

    //pleasure Predicting fields
    @Field()
    @MaxLength(Activity.CompletedWithMaxStringLength)
    completedWith: string;

    @Field()
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    satisfactionPredicted: number;

    @Field()
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    satisfactionActual: number;

    @Field()
    isForMastery: boolean; //if not for mastery, then it is for pleasure

    @Field({nullable:true})
    @MaxLength(ENTITY_ID_LENGTH)
    @MinLength(ENTITY_ID_LENGTH)
    scheduleId?: string;
}
