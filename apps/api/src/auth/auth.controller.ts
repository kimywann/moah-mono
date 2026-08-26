import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
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

    return this.authService.getCurrentUser(sessionToken);
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

    return result.user;
  }
}
