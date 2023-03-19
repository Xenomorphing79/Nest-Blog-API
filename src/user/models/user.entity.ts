import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserController } from '../controller/user.controller';
import { UserRole } from './user.interface';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  userName: string;
  @Column({ unique: true, nullable: false, default: '' })
  email!: string;
  @Column({ nullable: false, default: '' })
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Column({ nullable: true })
  profileImage: string;
  @BeforeInsert()
  emailLowercase() {
    this.email = this.email.toLowerCase();
  }
}
