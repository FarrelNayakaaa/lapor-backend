import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../../reports/entities/report.entity'; 
import { UserReward } from '../../rewards/entities/user-reward.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  // --- TAMBAHAN BARU ---
  @Column({ default: 0 }) 
  points: number; // Saldo Poin User

  // Satu User bisa punya Banyak Report
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
  // ---------------------

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserReward, (userReward) => userReward.user)
  userRewards: UserReward[];
}