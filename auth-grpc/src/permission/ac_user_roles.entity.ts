
import { Entity, Column, Index } from 'typeorm';


@Entity('ac_user_roles')
@Index(["user_id", "role_id"], { unique: true })
export class AcUserGroupEntity
{
    @Column({ type: 'text', nullable: true })
    user_id: string;

    @Column({ type: 'text', nullable: true })
    role_id: string;
}