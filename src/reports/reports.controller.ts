import { 
  Controller, Get, Post, Body, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' adalah nama key di form-data nanti
  create(
    @Body() createReportDto: CreateReportDto,
    
    // Validasi File: Maks 2MB, harus JPG/PNG
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    // Console log dulu buat ngecek filenya ketangkep atau enggak
    console.log('File berhasil diterima:', file.originalname);
    
    // Nanti di sini kita kirim ke Service untuk upload ke MinIO
    // Sementara kita kirim dummy text dulu ke database
    return this.reportsService.create(createReportDto, file);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
}