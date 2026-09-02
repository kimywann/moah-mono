import { createHash, randomBytes } from "node:crypto";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type LoginTicket, OAuth2Client } from "google-auth-library";
import { PrismaService } from "../prisma/prisma.service";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {
    this.googleClientId = configService.getOrThrow<string>("GOOGLE_CLIENT_ID");
    this.googleClient = new OAuth2Client(
      this.googleClientId,
      configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
      configService.get<string>("GOOGLE_REDIRECT_URI") ??
        "http://localhost:3001/auth/google/callback",
    );
  }

  async getCurrentUser(sessionToken?: string) {
    if (!sessionToken) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }

    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");
    const session = await this.prismaService.session.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          // 현재 시간보다 만료 시간이 뒤에 있는 세션만 찾기
          gt: new Date(),
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }

    return session.user;
  }

  async logout(sessionToken?: string) {
    if (!sessionToken) {
      return;
    }

    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    await this.prismaService.session.deleteMany({
      where: { tokenHash },
    });
  }

  async withdraw(userId: string) {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }

  getGoogleAuthorizationURL(state: string) {
    return this.googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: ["openid", "email", "profile"],
      state,
    });
  }

  async loginWithGoogleAuthorizationCode(code: string) {
    let idToken: string | null | undefined;

    try {
      const tokenResponse = await this.googleClient.getToken(code);
      idToken = tokenResponse.tokens.id_token;
    } catch {
      throw new UnauthorizedException("구글 로그인 정보를 확인할 수 없습니다.");
    }

    if (!idToken) {
      throw new UnauthorizedException("구글 로그인 정보를 확인할 수 없습니다.");
    }

    return this.loginWithGoogleIdToken(idToken);
  }

  private async loginWithGoogleIdToken(idToken: string) {
    let ticket: LoginTicket;

    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
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

    const rawSessionToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256")
      .update(rawSessionToken)
      .digest("hex");

    await this.prismaService.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      },
    });

    return {
      sessionToken: rawSessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    };
  }
}
