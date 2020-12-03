import { Body, Controller, Get, Param, Post, Put, Query, UseInterceptors, UsePipes } from "@nestjs/common";
import { ObjectIdFormat, ParamValidationPipe, QueryValidationPipe } from "@helpers/validation";
import { UpdatePasswordInput, UpdatePasswordOutput, CreateUserInput, CreateUserOutput, GetOnlineStatusInput, GetOnlineStatusOutput, UpdateOnlineStatusInput, UpdateOnlineStatusOutput, UserCommitService, UserQueryService } from "@src/user-management/core";
import { FindUserQuery } from "./controller.interfaces";
import { errors } from "../core";
import { FilesInterceptor } from "@nestjs/platform-express/multer/interceptors/files.interceptor";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserCommitService,
    private readonly queryService: UserQueryService
  ) { }

  @Post("/sign-up")
  @UseInterceptors(FilesInterceptor('files'))
  async createUser(@Body() input: CreateUserInput) {
    const user = await this.userService.createUser(input);
    return {
      uid: user._id,
      code: 0
    } as CreateUserOutput;
  }

  @Put("/update-password")
  @UseInterceptors(FilesInterceptor('files'))
  async updatePassword(@Body() input: UpdatePasswordInput) {
    await this.userService.updatePassword(input);
    return {
      code: 0
    } as UpdatePasswordOutput;
  }

  @Get("/online-status")
  async getOnlineStatus(@Body() input: GetOnlineStatusInput) {
    const onlineStatus = await this.queryService.getOnlineStatus(input.uid);
    return {
      onlineStatus: onlineStatus
    } as GetOnlineStatusOutput;
  }

  @Put("/update-online-status")
  async updateOnlineStatus(@Body() input: UpdateOnlineStatusInput) {
    const user = await this.userService.updateOnlineStatus(input);
    return {
      code: user ? 0 : 1
    } as UpdateOnlineStatusOutput
  }

  @Get("get")
  async getUserByID(@Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string) {
    const user = await this.queryService.findUserById(uid, { password: false, following: false, _id: false, __v: false });
    return user;
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
    const user = await this.queryService.findUserById(params.user_id);
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
  async findUserByIdWithQuery(@Query() query: FindUserQuery) {
    const user = await this.queryService.findUserById(query.user_id);
    if (!user) {
      throw new errors.UserNotFoundException();
    }
    return user;
  }
}