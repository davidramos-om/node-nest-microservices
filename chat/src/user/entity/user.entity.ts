
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn, 
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity
{
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({ type: 'varchar', nullable: false, unique: true }) screen_name: string;
    @Column({ type: 'varchar', nullable: false }) password: string;
    @Column({ type: 'varchar', nullable: false }) email: string;
    @Column({ type: 'bool', nullable: false }) enabled: boolean;
    @CreateDateColumn() createdAt?: Date;
    @CreateDateColumn() updatedAt?: Date;

    @BeforeInsert()
    async hashPassword()
    {
        this.password = await bcrypt.hash(this.password, 10);
    }
}