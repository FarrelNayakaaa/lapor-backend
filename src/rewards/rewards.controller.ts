import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // 1. Endpoint Seeding (Hanya dipanggil sekali lewat browser/postman)
  @Get('seed')
  seed() {
    return this.rewardsService.seed();
  }

  // 2. List Katalog (Bisa diakses publik/user)
  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  // 3. Redeem Poin (Wajib Login)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/redeem')
  redeem(@Param('id') id: string, @Request() req) {
    return this.rewardsService.redeem(req.user.userId, id);
  }

  // 4. Voucher Saya (Wajib Login)
  @UseGuards(AuthGuard('jwt'))
  @Get('my-vouchers')
  getMyVouchers(@Request() req) {
    return this.rewardsService.getMyVouchers(req.user.userId);
  }
}