import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import ini
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity'; // <--- Import ini

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]) 
  ],
  
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}