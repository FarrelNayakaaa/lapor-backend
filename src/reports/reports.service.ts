import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { User } from '../users/entities/user.entity';
import * as Minio from 'minio';

@Injectable()
export class ReportsService {
  private minioClient: Minio.Client;

  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minio_admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minio_password',
    });
  }

  async create(createReportDto: CreateReportDto, file: Express.Multer.File, userId: string) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const bucketName = process.env.MINIO_BUCKET || 'lapor-images';

    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );

    const configEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const configPort = process.env.MINIO_PORT || '9000';
    const photoUrl = `http://${configEndpoint}:${configPort}/${bucketName}/${fileName}`;

    // 1. find user yang login
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User pelapor tidak ditemukan di database');
    }
    // -------------------------

    const report = this.reportsRepository.create({
      title: createReportDto.title,
      description: createReportDto.description,
      status: 'pending',
      photoUrl: photoUrl,
      location: {
        type: 'Point',
        coordinates: [createReportDto.longitude, createReportDto.latitude], 
      },
      user: user, 
    });

    return await this.reportsRepository.save(report);
  }

  findAll() {
    return this.reportsRepository.find({ 
      relations: ['user'],
      order: { createdAt: 'DESC' } 
    });
  }

  async updateStatus(id: string, status: string) {
    const report = await this.reportsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });

    if (!report) {
      throw new Error('Laporan tidak ditemukan');
    }

    if (report.user) { 
      if (status === 'done' && report.status !== 'done') {
        report.user.points += 50; 
        await this.usersRepository.save(report.user);
        console.log(`[GAMIFICATION] User ${report.user.email} dapat +50 poin!`);
      }
      else if (status === 'in_progress' && report.status === 'pending') {
        report.user.points += 10;
        await this.usersRepository.save(report.user);
        console.log(`[GAMIFICATION] User ${report.user.email} dapat +10 poin!`);
      }
    }

    report.status = status;
    return await this.reportsRepository.save(report);
  }
}