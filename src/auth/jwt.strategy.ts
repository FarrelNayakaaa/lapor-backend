import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Baca token dari Header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'rahasiaNegara123', // Kunci rahasia
    });
  }

  async validate(payload: any) {
    // Ini yang akan ditempel ke 'req.user'
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}