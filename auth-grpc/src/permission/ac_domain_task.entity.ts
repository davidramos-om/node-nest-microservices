
import { Entity, Column, Index } from 'typeorm';


@Entity('ac_domain_task')
@Index(["domain_id", "task", "enabled"], { unique: true })
export class AcUserGroupEntity
{
    @Column({ type: 'text', nullable: false })
    domain_id: string;

    @Column({ type: 'text', nullable: false })
    task: string;

    @Column({ type: 'bool', nullable: false })
    enabled: boolean;
}