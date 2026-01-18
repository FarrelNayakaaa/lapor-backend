import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward } from './entities/reward.entity';
import { User } from '../users/entities/user.entity';
import { UserReward } from './entities/user-reward.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, User, UserReward]) // Masukkan UserReward
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}