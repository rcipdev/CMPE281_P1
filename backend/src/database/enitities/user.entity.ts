import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { File } from './file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne((type) => Role, (role) => role.roleName)
  @JoinColumn()
  role: Role;

  @OneToMany((type) => File, (file) => file.user)
  @JoinColumn()
  files: File[];
}
