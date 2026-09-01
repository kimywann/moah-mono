import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { z } from "zod";
import { AuthService } from "./auth.service";

const googleLoginRequestSchema = z.object({
  credential: z.string().trim().min(1),
});

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

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

  @Post("google")
  async googleLogin(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const request = googleLoginRequestSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("구글 로그인 정보를 확인해 주세요.");
    }

    const result = await this.authService.loginWithGoogle(
      request.data.credential,
    );

    response.cookie("session", result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      data: result.user,
    };
  }

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
