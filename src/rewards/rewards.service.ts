import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { User } from '../users/entities/user.entity';
import { UserReward } from './entities/user-reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private rewardsRepository: Repository<Reward>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserReward)
    private userRewardsRepository: Repository<UserReward>,
    private dataSource: DataSource, // Untuk Transaction (ACID)
  ) {}

  // 1. Ambil List Reward (Katalog)
  findAll() {
    return this.rewardsRepository.find({
      order: { pointsRequired: 'ASC' }
    });
  }

  // 2. Seeding Data (Buat ngisi stok awal doang)
  async seed() {
    const count = await this.rewardsRepository.count();
    if (count === 0) {
      const rewards = [
        { name: 'Voucher Parkir 1 Jam', pointsRequired: 50, stock: 100, partnerName: 'Mall Ruko A', description: 'Gratis parkir 1 jam pertama.', imageUrl: 'https://via.placeholder.com/150?text=Parkir' },
        { name: 'Kopi Susu Gula Aren', pointsRequired: 100, stock: 50, partnerName: 'Kopi Kenangan', description: 'Diskon 100% untuk 1 cup reguler.', imageUrl: 'https://via.placeholder.com/150?text=Kopi' },
        { name: 'Potongan Belanja 10rb', pointsRequired: 200, stock: 20, partnerName: 'Indomaret', description: 'Min. belanja 50rb.', imageUrl: 'https://via.placeholder.com/150?text=Diskon' },
      ];
      await this.rewardsRepository.save(rewards);
      return 'Data seeded!';
    }
    return 'Data already exists.';
  }

  // 3. TRANSAKSI PENUKARAN (The Core Logic)
  async redeem(userId: string, rewardId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      const reward = await queryRunner.manager.findOne(Reward, { where: { id: rewardId } });

      // --- PERBAIKAN: TAMBAHKAN CEK USER ---
      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }
      // -------------------------------------

      if (!reward) throw new NotFoundException('Reward tidak ditemukan');
      if (reward.stock <= 0) throw new BadRequestException('Stok habis bos!');
      
      // TypeScript sekarang tau user PASTI ada, jadi error hilang
      if (user.points < reward.pointsRequired) throw new BadRequestException('Poin tidak cukup. Rajin lapor lagi ya!');

      user.points -= reward.pointsRequired;
      reward.stock -= 1;

      const voucherCode = `${reward.partnerName.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
      
      const userReward = new UserReward();
      userReward.user = user;
      userReward.reward = reward;
      userReward.uniqueCode = voucherCode;

      await queryRunner.manager.save(user);
      await queryRunner.manager.save(reward);
      await queryRunner.manager.save(userReward);

      await queryRunner.commitTransaction();

      return { 
        message: 'Redeem Berhasil!', 
        voucherCode, 
        remainingPoints: user.points 
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 4. Lihat Voucher Saya
  async getMyVouchers(userId: string) {
    return this.userRewardsRepository.find({
      where: { user: { id: userId } },
      relations: ['reward'],
      order: { redeemedAt: 'DESC' }
    });
  }
}