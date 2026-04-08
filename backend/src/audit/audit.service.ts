import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        changes: changes || {},
      },
    });
  }

  async getLogs(userRole: string) {
    if (userRole !== "ADMIN") {
      throw new ForbiddenException("Only administrators can view audit logs");
    }

    return this.prisma.auditLog.findMany({
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
