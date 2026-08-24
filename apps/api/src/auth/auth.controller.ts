import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { AuthService } from "./auth.service";

const googleLoginRequestSchema = z.object({
  credential: z.string().trim().min(1),
});

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("google")
  async googleLogin(@Body() body: unknown) {
    const request = googleLoginRequestSchema.safeParse(body);

    if (!request.success) {
      throw new BadRequestException("구글 로그인 정보를 확인해 주세요.");
    }

    return this.authService.loginWithGoogle(request.data.credential);
  }
}
