import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TaskModule } from "./task/task.module";
import { AuditModule } from "./audit/audit.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TaskModule,
    AuditModule,
  ],
})
export class AppModule {}
