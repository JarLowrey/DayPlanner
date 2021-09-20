import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeInsert, Column } from "typeorm";
import { ObjectType, Field, ID, InterfaceType } from "type-graphql";
import { nanoid } from 'nanoid'
export const ENTITY_ID_LENGTH = 11;

@InterfaceType()
export abstract class ParentEntity extends BaseEntity {
    @Field(type => ID)
    @PrimaryColumn() public id: string;

    @Field()
    @CreateDateColumn() public createdAt: Date;

    @Field()
    @UpdateDateColumn() public updatedAt: Date;

    @BeforeInsert()
    private beforeInsert() {
        this.id = nanoid(ENTITY_ID_LENGTH);
    }
}
