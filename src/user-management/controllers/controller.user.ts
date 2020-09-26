import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateUserInput, UserCommitService } from "../core";



@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserCommitService) {}

  @ApiBody({ type: [CreateUserInput] })
  @Post()
  createUser(@Body() input: CreateUserInput) {
    this.userService.createUser(input);
  }
}