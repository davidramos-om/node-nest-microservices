
import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';


@Entity('ac_domain')
@Index(["id"], { unique: true })
@Index(["app_id", "enabled"], { unique: false })
export class AcDomainEntity
{
    @PrimaryGeneratedColumn() id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'bool', nullable: false })
    enabled: boolean;

    @Column({ type: 'text', nullable: false })
    app_id: string;

    @CreateDateColumn({ nullable: false }) created_at?: Date;
}