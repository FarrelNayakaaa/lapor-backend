import { 
  Controller, Get, Post, Body, Patch, Param, Request, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, 
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Request() req, 
    @Body() createReportDto: CreateReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    // req.user.userId dpt auto dr AuthGuard (JWT Strategy)
    console.log('User yang melapor ID:', req.user.userId);
    return this.reportsService.create(createReportDto, file, req.user.userId);
  }
  
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @UseGuards(AuthGuard('jwt')) 
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body() updateReportStatusDto: UpdateReportStatusDto
  ) {
    return this.reportsService.updateStatus(id, updateReportStatusDto.status);
  }
}