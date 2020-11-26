
import { Entity, Column, Index } from 'typeorm';


@Entity('ac_role_domain')
@Index(["role_id", "domain_id"], { unique: true })
export class AcRoleGroupEntity
{
    @Column({ type: 'text', nullable: false })
    role_id: string;

    @Column({ type: 'text', nullable: false })
    domain_id: string;

}