import { 
  Controller, Get, Post, Body, Patch, Param, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    console.log('File berhasil diterima:', file.originalname);
    return this.reportsService.create(createReportDto, file);
  }
  
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body() updateReportStatusDto: UpdateReportStatusDto
  ) {
    return this.reportsService.updateStatus(id, updateReportStatusDto.status);
  }
}