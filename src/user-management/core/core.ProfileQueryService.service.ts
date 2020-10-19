import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FindProfileInput } from "./core.dto.profile";
import { ProfileNotFoundException } from "./core.errors";
import { Profile } from "./core.profile.model";

@Injectable()
export class ProfileQueryService {
    constructor(
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>
    ) { }

    async findProfile(uid: string) {
        const profile = await this.profileModel.findOne({ uid: uid })
        if (!profile) {
            throw new ProfileNotFoundException();
        }
        return profile;
    }
}