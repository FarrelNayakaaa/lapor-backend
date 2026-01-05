import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // 1. Buat object report baru
    const report = this.reportsRepository.create({
      title: createReportDto.title,
      description: createReportDto.description,
      status: 'pending', // Default status
      
      // 2. MAGIC: Konversi Lat/Long ke Format GeoJSON PostGIS
      location: {
        type: 'Point',
        coordinates: [createReportDto.longitude, createReportDto.latitude], 
      },
    });

    // 3. Simpan ke database
    return await this.reportsRepository.save(report);
  }

  findAll() {
    return this.reportsRepository.find();
  }
}