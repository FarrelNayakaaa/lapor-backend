import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reward } from './reward.entity';

@Entity()
export class UserReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  uniqueCode: string;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => User, (user) => user.userRewards)
  user: User;

  @ManyToOne(() => Reward, (reward) => reward.userRewards)
  reward: Reward;

  @CreateDateColumn()
  redeemedAt: Date;
}