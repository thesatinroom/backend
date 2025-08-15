import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User not found or inactive');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        sub: user.id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
