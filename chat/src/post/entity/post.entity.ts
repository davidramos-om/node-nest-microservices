
import
{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

import { POST_TYPE } from '../../common/enums';

@Entity('post')
export class PostEntity
{
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column({ type: 'text', nullable: false }) title: string;

    @Column({ type: 'text', nullable: true }) body: string;

    @Column({ type: 'text', nullable: false }) postType: POST_TYPE;

    @Column({ type: 'text', nullable: true }) mediaPath: string;

    @Column({ type: 'json', nullable: true }) mediaMeta: string;;

    @Column({ type: 'int4', nullable: false, default: 0 }) score: number;

    @Column({ type: 'int4', nullable: false, default: 0 }) votes: number;

    @Column({ type: 'int4', nullable: false, default: 0 }) viewCount: number;

    @Column({ type: 'text', nullable: true }) originalPoster: string;

    @Column({ type: 'jsonb', nullable: true }) tags: string[];

    @Column({ type: 'bool', nullable: false, default: true }) commentEnabled: boolean;

    @Column({ type: 'bool', nullable: false, default: false }) deleted: boolean;

    @Column({ type: 'bool', nullable: false, default: true }) approved: boolean;

    @Column({ type: 'bool', nullable: false, default: false }) banned: boolean;

    @CreateDateColumn() deletedDate?: Date;

    @CreateDateColumn() createdAt?: Date;

    @CreateDateColumn() updatedAt?: Date;

    @Column({ type: 'varchar', nullable: false }) app_id: string;

    @Column({ type: 'varchar', nullable: false }) group_id: string;

}