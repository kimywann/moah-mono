import { randomBytes } from "node:crypto";
import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { z } from "zod";
import { AuthService } from "./auth.service";

const googleCallbackQuerySchema = z.object({
  code: z.string().trim().min(1),
  state: z.string().trim().min(1),
});

const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Get("me")
  async getCurrentUser(@Headers("cookie") cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));
    const sessionToken = sessionCookie?.trim().slice("session=".length);

    const user = await this.authService.getCurrentUser(sessionToken);

    return {
      success: true,
      data: user,
    };
  }

  @Delete("me")
  async withdraw(
    @Headers("cookie") cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    await this.authService.withdraw(user.id);

    response.clearCookie("session", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers("cookie") cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionToken = this.getSessionToken(cookieHeader);

    await this.authService.logout(sessionToken);

    response.clearCookie("session", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  }

  @Get("google")
  startGoogleLogin(@Res() response: Response) {
    const state = randomBytes(32).toString("hex");

    response.cookie(GOOGLE_OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/auth/google",
      maxAge: 1000 * 60 * 10,
    });

    response.redirect(this.authService.getGoogleAuthorizationURL(state));
  }

  @Get("google/callback")
  async completeGoogleLogin(
    @Headers("cookie") cookieHeader: string | undefined,
    @Query() query: unknown,
    @Res() response: Response,
  ) {
    const request = googleCallbackQuerySchema.safeParse(query);
    const state = this.getCookieValue(cookieHeader, GOOGLE_OAUTH_STATE_COOKIE);

    response.clearCookie(GOOGLE_OAUTH_STATE_COOKIE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/auth/google",
    });

    if (!request.success || !state || request.data.state !== state) {
      response.redirect(this.getGoogleLoginFailureURL());
      return;
    }

    try {
      const result = await this.authService.loginWithGoogleAuthorizationCode(
        request.data.code,
      );

      response.cookie("session", result.sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      response.redirect(this.getFrontendURL());
    } catch {
      response.redirect(this.getGoogleLoginFailureURL());
    }
  }

  private getSessionToken(cookieHeader?: string) {
    return this.getCookieValue(cookieHeader, "session");
  }

  private getCookieValue(cookieHeader: string | undefined, name: string) {
    const cookie = cookieHeader
      ?.split(";")
      .find((item) => item.trim().startsWith(`${name}=`));

    return cookie?.trim().slice(`${name}=`.length);
  }

  private getFrontendURL() {
    return (
      this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:5173"
    );
  }

  private getGoogleLoginFailureURL() {
    return new URL(
      "/login?error=google-login",
      this.getFrontendURL(),
    ).toString();
  }
}
