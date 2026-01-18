import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kita hapus endpoint Create/Update/Delete bawaan karena:
  // 1. Create User sudah ditangani di 'AuthService' (Register)
  // 2. Kita tidak mau sembarang orang lihat semua user (findAll)

  @UseGuards(AuthGuard('jwt')) // <--- Wajib Login
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user.userId didapat otomatis dari Token JWT
    const user = await this.usersService.findOne(req.user.userId);
    
    if (user) {
      // Security: Hapus password dari data sebelum dikirim ke frontend
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}