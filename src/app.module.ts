import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import Entities
import { Report } from './reports/entities/report.entity';
import { User } from './users/entities/user.entity';
import { Reward } from './rewards/entities/reward.entity';
import { UserReward } from './rewards/entities/user-reward.entity'; // <--- TAMBAHAN PENTING 1

// Import Modules
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433'), 
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      
      // --- PERBAIKAN DI SINI ---
      // UserReward wajib dimasukkan agar relasi database terbaca
      entities: [Report, User, Reward, UserReward], 
      // ------------------------
      
      synchronize: true,
    }),
    ReportsModule,
    UsersModule,
    AuthModule,
    RewardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}