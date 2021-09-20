import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InterfaceType } from "type-graphql";
import { User } from "@models/User";
import { ParentEntity } from "@models/ParentEntity";

@InterfaceType({ implements: ParentEntity })
export abstract class UserCreatedEntity extends ParentEntity {
    @Field(type => User)
    @ManyToOne(type => User, { onDelete:"CASCADE" })
    userCreator: User;

    @Column({ nullable: true })
    @Field()
    userCreatorId: string;
}
