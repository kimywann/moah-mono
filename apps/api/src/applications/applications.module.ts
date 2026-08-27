import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
