import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // tabel database
export class Report {
  @PrimaryGeneratedColumn('uuid') // ID in UUID format
  id: string;

  @Column()
  title: string;

  @Column('text') 
  description: string;

  @Column({ nullable: true }) // later (for photo)
  photoUrl: string;

  @Column({ default: 'pending' }) // default stats
  status: string;

  // POSTGIS
  // Save loc as coordinat (Point)
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: any; 

  @CreateDateColumn()
  createdAt: Date;
}