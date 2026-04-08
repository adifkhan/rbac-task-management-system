import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuditLogService } from "./audit.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("audit")
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  getLogs(@Request() req) {
    return this.auditLogService.getLogs(req.user.role);
  }
}
