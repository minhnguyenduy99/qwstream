import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./core.user.model";
import { UserInvalidException, UserNotFoundException } from "./core.errors";
import { EncryptService } from "@services/encrypt";
import { LoginUserInput, LoginUserOutput } from "./core.dto.user";

@Injectable()
export class UserQueryService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly encryptService: EncryptService
    ) { }

    async findUserById(userId: string) {
        const user = await this.userModel.findById(userId);
        return user;
    }

    async findUserByUsername(username: string) {
        const user = await this.userModel.findOne({ username: username });
        return user;
    }

    async checkLogin(user: LoginUserInput): Promise<LoginUserOutput> {
        const _user = await this.findUserByUsername(user.username);
        if (!_user) {
            throw new UserInvalidException();
        }
        if (await this.encryptService.compare(user.password, _user.password)) {
            return {
                code: 0
            }
        } else {
            throw new UserInvalidException();
        }
    }

    async getOnlineStatus(uid: string) {
        const user = await this.findUserById(uid);
        return user.onlineStatus;
    }

    async isFollow(cid: string, uid: string) {
        const user = await this.userModel.findById(uid, { _id: 1 });
        if (!user) {
            throw new UserNotFoundException();
        }
        const channel = await this.userModel.findOne({
            _id: uid,
            following: {
                $in: [cid]
            }
        }, { _id: 1 });
        return !!channel
    }
}