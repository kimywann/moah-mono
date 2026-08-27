import { Controller, Get, Headers, Inject } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { ApplicationsService } from "./applications.service";

@Controller("applications")
export class ApplicationsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ApplicationsService)
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  async findAll(@Headers("cookie") cookieHeader?: string) {
    const user = await this.authService.getCurrentUser(
      this.getSessionToken(cookieHeader),
    );

    return {
      success: true,
      data: await this.applicationsService.findAllByUserId(user.id),
    };
  }

  private getSessionToken(cookieHeader?: string) {
    const sessionCookie = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("session="));

    return sessionCookie?.trim().slice("session=".length);
  }
}
