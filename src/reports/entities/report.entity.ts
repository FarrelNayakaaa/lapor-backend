import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Import User

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  photoUrl: string;

  @Column({ default: 'pending' })
  status: string;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  location: { type: string; coordinates: number[] };

  // Banyak Report dimiliki oleh Satu User
  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'SET NULL' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}