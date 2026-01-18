import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateReportStatusDto {
  @IsNotEmpty()
  @IsEnum(['pending', 'in_progress', 'done', 'rejected'])
  status: string;
}