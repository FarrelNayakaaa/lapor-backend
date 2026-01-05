import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import * as Minio from 'minio';

@Injectable()
export class ReportsService {
  private minioClient: Minio.Client;

  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {
    this.minioClient = new Minio.Client({
      // PERBAIKAN: Tambahkan || 'default value'
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minio_admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minio_password',
    });
  }

  async create(createReportDto: CreateReportDto, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    // Ambil nama bucket, kalau di env kosong pake 'lapor-images'
    const bucketName = process.env.MINIO_BUCKET || 'lapor-images';

    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );

    // Generate URL
    const configEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const configPort = process.env.MINIO_PORT || '9000';
    
    const photoUrl = `http://${configEndpoint}:${configPort}/${bucketName}/${fileName}`;

    const report = this.reportsRepository.create({
      title: createReportDto.title,
      description: createReportDto.description,
      status: 'pending',
      photoUrl: photoUrl,
      location: {
        type: 'Point',
        coordinates: [createReportDto.longitude, createReportDto.latitude], 
      },
    });

    return await this.reportsRepository.save(report);
  }

  findAll() {
    return this.reportsRepository.find();
  }
}