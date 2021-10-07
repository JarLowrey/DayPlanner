import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Max, Min, IsInt } from 'class-validator';
import { ObjectType, Field, InterfaceType, Int } from "type-graphql";
import { Schedule } from "@models/Schedule";
import { UserCreatedEntity } from "@models/UserCreatedEntity";
import { LENGTH_STRING_SMALL,LENGTH_STRING_MEDIUM,LENGTH_STRING_LONG } from "util/encrypt";
import { ENTITY_ID_LENGTH, ParentEntity } from "@models/ParentEntity";

@Entity()
@ObjectType({ implements: [UserCreatedEntity, ParentEntity] })
export class Activity extends UserCreatedEntity {
    static readonly MinStartingMinute = 0;
    static readonly MaxStartingMinute = 2359;
    static readonly MinEffectiveness = 0;
    static readonly MaxEffectiveness = 4;
    static readonly DescrMaxStringLength = 100;

    @Field()  
    @Column('time', { nullable: false })
    startingTime: string;

    @Field()  
    @Column('time', { nullable: false })
    endingTime: string;

    @Field()
    @Column({
        type: "varchar",
        length: Activity.DescrMaxStringLength,
        nullable: false
    })
    descr: string;

    @Field()
    @Column({
        type: "bool",
        nullable: true
    })
    completedWithGroup: boolean;

    @Field()
    @Column({
        type: "int",
        nullable: true
    })
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    satisfaction: number;

    @Field()
    @Column({
        type: "int",
        nullable: true
    })
    @IsInt()
    @Min(Activity.MinEffectiveness)
    @Max(Activity.MaxEffectiveness)
    difficulty: number;


    //should be enum instead?
    @Field()
    @Column({
        type: "int",
        nullable: true
    })
    @Min(0)
    @Max(100)
    purpose: number; //if not for mastery, then it is for pleasure

    @Field()
    @Column({
        type: "bool",
        nullable: true,
        default: false
    })
    isRetrospective: boolean; //if not for mastery, then it is for pleasure

    @Field(type => Schedule)
    @ManyToOne(type => Schedule, schedule => schedule.items, { onDelete: 'CASCADE' })
    schedule: Schedule;

    @Column({ 
        type: "varchar",
        length: ENTITY_ID_LENGTH,
        nullable: false
    })
    @Field()
    scheduleId: string;
}
