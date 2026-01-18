import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'; 
import { UserReward } from './user-reward.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string; 

  @Column()
  pointsRequired: number; 

  @Column({ default: 0 })
  stock: number; 

  @Column({ nullable: true })
  imageUrl: string; 

  @Column({ nullable: true })
  partnerName: string; 

  @CreateDateColumn()
  createdAt: Date;

  // Sekarang OneToMany sudah dikenal
  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userRewards: UserReward[];
}