import { type } from 'os';
import { blogEntryEntity } from 'src/blog/models/blogEntry.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
  @Column({ nullable: false, default: '', select: false })
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Column({ nullable: true })
  profileImage: string;
  @OneToMany(
    (type) => blogEntryEntity,
    (blogEntryEntity) => blogEntryEntity.author,
  )
  blogEntries: blogEntryEntity[];
  @BeforeInsert()
  emailLowercase() {
    this.email = this.email.toLowerCase();
  }
}
