import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptService } from "@services/encrypt";
import { UserAlreadyFollowedException, UsernameWasTakenException, UserNotFollowedException, UserNotFoundException, WrongPasswordException } from "./core.errors";
import { User } from "./core.user.model";
import { UserQueryService } from "./core.UserQueryService.service";
import { UpdatePasswordInput, CreateUserInput, UpdateOnlineStatusInput } from "./core.dto.user";
import { ProfileCommitService } from "./core.ProfileCommitService.service";

@Injectable()
export class UserCommitService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly queryService: UserQueryService,
        private readonly profileCommitService: ProfileCommitService,
        private readonly encryptService: EncryptService
    ) { }

    async createUser(input: CreateUserInput) {
        const checkUser = await this.queryService.findUserByUsername(input.username);
        if (checkUser) {
            throw new UsernameWasTakenException();
        }
        input.password = await this.encryptService.hash(input.password);
        const createUser = new this.userModel(input);
        const user = await createUser.save();
        this.profileCommitService.createProfile({ uid: user._id });
        return user;
    }

    async updatePassword(input: UpdatePasswordInput) {
        const user = await this.queryService.findUserById(input.uid);
        if (!user) {
            throw new UserNotFoundException();
        }
        if (!await this.encryptService.compare(input.oldPassword, user.password)) {
            throw new WrongPasswordException();
        }
        user.password = await this.encryptService.hash(input.newPassword);
        user.save();
    }

    async onFollow(cid: string, uid: string) {
        const isFollow = await this.queryService.isFollow(cid, uid);
        if (isFollow) {
            throw new UserAlreadyFollowedException();
        }
        return this.userModel.updateOne({ _id: uid }, {
            $push: { following: cid },
            $inc: { count: 1 }
        })
    }

    async onUnfollow(cid: string, uid: string) {
        const isFollow = await this.queryService.isFollow(cid, uid);
        if (!isFollow) {
            throw new UserNotFollowedException();
        }
        return this.userModel.updateOne({ _id: uid }, {
            $pull: { followers: cid },
            $inc: { count: -1 }
        })
    }

    async updateOnlineStatus(input: UpdateOnlineStatusInput) {
        let user = await this.queryService.findUserById(input.uid);
        if (user.onlineStatus == input.onlineStatus) {
            user.onlineStatus = input.onlineStatus;
            return user.save();
        }
        return null;
    }
}