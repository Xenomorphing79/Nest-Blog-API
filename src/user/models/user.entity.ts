import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @BeforeInsert()
  emailLowercase() {
    this.email = this.email.toLowerCase();
  }
}
