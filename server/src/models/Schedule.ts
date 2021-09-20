import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { ENTITY_ID_LENGTH, ParentEntity } from "@models/ParentEntity";
import { Max, Min, IsInt } from 'class-validator';
import { ObjectType, Field, InterfaceType } from "type-graphql";
import { Activity } from "@models/Activity";
import { UserCreatedEntity } from "@models/UserCreatedEntity";

@Entity()
@ObjectType({ implements: [UserCreatedEntity, ParentEntity] })
export class Schedule extends UserCreatedEntity {
    @Field()
    @Column({
        type: "timestamp",
        precision: 0,
        nullable: false,
        unique: true
    })
    date: Date;

    @Field(type=>[Activity])
    @OneToMany(type => Activity, item => item.schedule)
    items: Activity[];
}
