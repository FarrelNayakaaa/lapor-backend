import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Ini memberitahu TypeORM bahwa class ini adalah tabel database
export class Report {
  @PrimaryGeneratedColumn('uuid') // ID otomatis pakai format UUID (biar unik & keren)
  id: string;

  @Column()
  title: string;

  @Column('text') // Tipe text untuk tulisan panjang
  description: string;

  @Column({ nullable: true }) // Boleh kosong dulu (karena foto di-handle belakangan)
  photoUrl: string;

  @Column({ default: 'pending' }) // Status default saat lapor pertama kali
  status: string;

  // INI BAGIAN SPESIAL: POSTGIS
  // Kita menyimpan lokasi sebagai titik koordinat (Point)
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326, // 4326 adalah standar kode GPS dunia (WGS84)
    nullable: true,
  })
  location: string; 

  @CreateDateColumn()
  createdAt: Date;
}