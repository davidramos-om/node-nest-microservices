
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn, 
  BeforeInsert,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Index(["email", "app_id", "enabled"], { unique: true })
export class UserEntity
{
  @PrimaryGeneratedColumn('uuid') id: string;
    
  @Column({ type: 'varchar', nullable: false })
  @Index("screen_name-idx")
  screen_name: string;
  
  @Column({ type: 'varchar', nullable: false })
  password: string;
  
  
  @Column({ type: 'varchar', nullable: false })
  @Index("email-idx")
  email: string;
  
  @Column({ type: 'bool', nullable: false, default: true }) enabled: boolean;
  
  @CreateDateColumn() createdAt?: Date;
  
  @CreateDateColumn() updatedAt?: Date;
  
  @Column({ type: 'varchar', nullable: false })
  app_id: string;

  @BeforeInsert()
  async hashPassword()
  {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}