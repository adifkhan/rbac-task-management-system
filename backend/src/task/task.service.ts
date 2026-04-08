import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogService } from "../audit/audit.service";
import { TaskStatus } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async createTask(data: any, userId: string, userRole: string) {
    if (userRole !== "ADMIN") {
      throw new ForbiddenException("Only administrators can create tasks");
    }

    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo || null,
        status: TaskStatus.PENDING,
      },
      include: {
        assignedUser: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    await this.auditLogService.log(userId, "TASK_CREATED", "Task", task.id, {
      new: task,
    });

    return task;
  }

  async updateTask(id: string, data: any, userId: string, userRole: string) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException("Task not found");
    }

    if (userRole !== "ADMIN") {
      if (existingTask.assignedTo !== userId) {
        throw new ForbiddenException(
          "You can only update tasks assigned to you",
        );
      }
      const allowedUpdates =
        Object.keys(data).length === 1 && data.status !== undefined;
      if (!allowedUpdates) {
        throw new ForbiddenException("Users can only update task status");
      }
    }

    const changes = {
      before: {
        title: existingTask.title,
        description: existingTask.description,
        status: existingTask.status,
        assignedTo: existingTask.assignedTo,
      },
      after: data,
    };

    const task = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        assignedUser: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    await this.auditLogService.log(
      userId,
      "TASK_UPDATED",
      "Task",
      task.id,
      changes,
    );

    return task;
  }

  async deleteTask(id: string, userId: string, userRole: string) {
    if (userRole !== "ADMIN") {
      throw new ForbiddenException("Only administrators can delete tasks");
    }

    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    await this.auditLogService.log(userId, "TASK_DELETED", "Task", task.id, {
      deleted: task,
    });

    return this.prisma.task.delete({ where: { id } });
  }

  async getTasks(userId: string, userRole: string) {
    if (userRole === "ADMIN") {
      return this.prisma.task.findMany({
        include: {
          assignedUser: {
            select: { id: true, email: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return this.prisma.task.findMany({
      where: { assignedTo: userId },
      include: {
        assignedUser: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAvailableUsers(userRole: string) {
    if (userRole !== "ADMIN") {
      throw new ForbiddenException("Only administrators can view users");
    }

    return this.prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, email: true, name: true },
    });
  }
}
