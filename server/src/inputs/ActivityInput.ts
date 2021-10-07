import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { MaxLength, ValidateNested, IsArray, MinLength, Max, Min, IsInt } from 'class-validator';
import { ObjectType, Field, Int, InputType } from "type-graphql";
import { Activity } from "@models/Activity";
import { ENTITY_ID_LENGTH } from '@models/ParentEntity';

@InputType()
export class ActivityInput {
    @Field({nullable:true})
    startingTime: string;

    @Field({nullable:true})
    endingTime: string;
    
    @Field({nullable:true})
    @MaxLength(Activity.DescrMaxStringLength)
    descr: string;

    
    @Field({nullable:true})
    completedWithGroup: boolean;

    @Field({nullable:true})
    isRetrospective: boolean;

    @Field({nullable:true})
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    satisfaction: number;

    @Field({nullable:true})
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    difficulty: number;

    @Field({nullable:true})
    @IsInt()
    @Min(0)
    @Max(100)
    purpose: number;

    @Field({nullable:true})
    @MaxLength(ENTITY_ID_LENGTH)
    @MinLength(ENTITY_ID_LENGTH)
    scheduleId?: string;
}
