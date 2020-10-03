import { Body, Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ParamValidationPipe, QueryValidationPipe } from "@helpers/validation";
import { CreateUserInput, UserCommitService } from "@src/user-management/core";
import { FindUserQuery } from "./controller.interfaces";
import { errors } from "../core";


@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserCommitService) {}

  @ApiBody({ type: [CreateUserInput] })
  @Post()
  createUser(@Body() input: CreateUserInput) {
    this.userService.createUser(input);
  }

  /**
   * Như method ở dưới, cần validate user_id và profile_id thì dùng Pipe.
   * 
   * Vì đang cần validate param nên sẽ dùng `ParamValidationPipe`
   * @param params `FindUserQuery` là class dùng để định dạng param. Các validate được đặt
   * trong class này
   */
  @Get("/:user_id/:profile_id")
  @UsePipes(ParamValidationPipe)      
  async findUserById(@Param() params: FindUserQuery) {
    const user = await this.userService.findUserById(params.user_id);
    if (!user) {
      throw new errors.UserNotFoundException();
    }
    return user;
  }

  /**
   * Ví dụ này tương tự trên nhưng sử dụng query thay vì param.
   * 
   * Example: `/user?user_id=ab&profile_id=a24252`
   * @param query 
   */
  @Get()
  @UsePipes(QueryValidationPipe)
  async fileUserByIdWithQuery(@Query() query: FindUserQuery) {
    const user = await this.userService.findUserById(query.user_id);
    if (!user) {
      throw new errors.UserNotFoundException();
    }
    return user;
  }
}