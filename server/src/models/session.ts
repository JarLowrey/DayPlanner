import { Entity, Column, PrimaryColumn, Index, BaseEntity } from "typeorm";

@Entity()
export class session extends BaseEntity{
    @PrimaryColumn({
        type: "varchar",
        nullable: false,
        //collation:"" //needed?
    })
    sid: string;

    @Column({
        type: "json",
        nullable: false
    })
    sess: any;

    @Index("IDX_session_expire")
    @Column({
        type: "timestamp",
        precision: 6,
        nullable: false
    })
    expire: Date;
}
