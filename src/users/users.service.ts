import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Fungsi untuk mencari user berdasarkan UUID (String)
  // Dan memuat relasi 'reports' (History Laporan)
  async findOne(id: string) {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['reports'], // <--- Supaya muncul di Profil
      order: {
        reports: {
          createdAt: 'DESC', // <--- Laporan terbaru paling atas
        }
      }
    });
  }
}