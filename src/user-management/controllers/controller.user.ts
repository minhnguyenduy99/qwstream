import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ObjectIdFormat, ParamValidationPipe, QueryValidationPipe } from "@helpers/validation";
import { UpdatePasswordInput, UpdatePasswordOutput, CreateUserInput, CreateUserOutput, GetOnlineStatusInput, GetOnlineStatusOutput, UpdateOnlineStatusInput, UpdateOnlineStatusOutput, UserCommitService, UserQueryService } from "@src/user-management/core";
import { FilesInterceptor } from "@nestjs/platform-express/multer/interceptors/files.interceptor";
import { AuthorizeClass, AuthorizeMethod, NonAuthorize } from "src/authorization";
import { ActionType } from "src/authorization/consts";
import { AuthorizationGuard } from "src/authorization/guards/authorization-guard";

@Controller("user")
@AuthorizeClass({ entity: "UserEntity" })
@UseGuards(AuthorizationGuard())
export class UserController {
  constructor(
    private readonly userService: UserCommitService,
    private readonly queryService: UserQueryService
  ) { }

  @Post("/sign-up")
  @UseInterceptors(FilesInterceptor('files'))
  @NonAuthorize()
  async createUser(@Body() input: CreateUserInput) {
    const user = await this.userService.createUser(input);
    return {
      uid: user._id,
      code: 0
    } as CreateUserOutput;
  }

  @Put("/update-password")
  @UseInterceptors(FilesInterceptor('files'))
  @AuthorizeMethod({
    type: ActionType.resource
  })
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
  @AuthorizeMethod({
    type: ActionType.resource,
    resourceHandler: req => req.body.uid
  })
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
}