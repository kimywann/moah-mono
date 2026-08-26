import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type LoginTicket, OAuth2Client } from "google-auth-library";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {
    this.googleClientId = configService.getOrThrow<string>("GOOGLE_CLIENT_ID");
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async loginWithGoogle(credential: string) {
    let ticket: LoginTicket;

    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: this.googleClientId,
      });
    } catch {
      throw new UnauthorizedException("구글 로그인 정보를 확인할 수 없습니다.");
    }

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException("구글 로그인 정보를 확인할 수 없습니다.");
    }

    const user = await this.prismaService.user.upsert({
      where: { googleId: payload.sub },
      update: {
        name: payload.name ?? null,
        profileImage: payload.picture ?? null,
      },
      create: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? null,
        profileImage: payload.picture ?? null,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    };
  }
}
