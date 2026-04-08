import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  createTask(@Body() body: any, @Request() req: any) {
    return this.taskService.createTask(body, req.user.id, req.user.role);
  }

  @Get()
  getTasks(@Request() req: any) {
    return this.taskService.getTasks(req.user.id, req.user.role);
  }

  @Get("users")
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  getUsers(@Request() req: any) {
    return this.taskService.getAvailableUsers(req.user.role);
  }

  @Get(":id")
  getTask(@Param("id") id: string, @Request() req: any) {
    return this.taskService.getTask(id, req.user.id, req.user.role);
  }

  @Put(":id")
  updateTask(@Param("id") id: string, @Body() body: any, @Request() req: any) {
    return this.taskService.updateTask(id, body, req.user.id, req.user.role);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string, @Request() req: any) {
    return this.taskService.deleteTask(id, req.user.id, req.user.role);
  }
}
