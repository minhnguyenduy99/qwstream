import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileNotFoundException, UserNotFoundException } from "./core.errors";
import { CreateProfileInput, UpdateProfileInput } from "./core.dto.profile";
import { Profile } from "./core.profile.model";
import { UserQueryService } from "./core.UserQueryService.service";
import { ProfileQueryService } from "./core.ProfileQueryService.service";

@Injectable()
export class ProfileCommitService {
    constructor(
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
        private readonly profileQueryService: ProfileQueryService,
        private readonly userQueryService: UserQueryService
    ) { }

    async createProfile(input: CreateProfileInput) {
        const user = await this.userQueryService.findUserById(input.uid)
        if (!user) {
            throw new UserNotFoundException();
        }
        const profile = new this.profileModel();
        profile.uid = user._id;
        profile.nickname = user.username;
        return await profile.save();
    }

    async updateProfile(input: UpdateProfileInput) {
        const uid = input.uid;
        delete input.uid;

        await this.profileModel.updateOne({ uid: uid }, input);
    }
}