import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async guestLogin(dto: GuestLoginDto) {
    const user = await this.prisma.user.create({
      data: { name: dto.name, isGuest: true },
    });

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      name: user.name,
    });

    return {
      accessToken,
      user: { id: user.id, name: user.name, isGuest: user.isGuest },
    };
  }
}
