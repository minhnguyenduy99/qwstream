import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileUploadAvatarException, UserNotFoundException } from "./core.errors";
import { CreateProfileInput, UpdateProfileInput, UploadAvatarInput } from "./core.dto.profile";
import { Profile } from "./core.profile.model";
import { UserQueryService } from "./core.UserQueryService.service";
import { ImageStorageCodes, ImageStorageService } from "src/services/image-storage";

@Injectable()
export class ProfileCommitService {
    constructor(
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
        private readonly userQueryService: UserQueryService,
        private readonly imageStorageService: ImageStorageService
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

    async updateAvatarFromDevice(input: UploadAvatarInput) {
        if (input.file === undefined){
            throw new ProfileUploadAvatarException("File not found!")
        }
        const res = await this.imageStorageService.uploadImage({ file: input.file });
        if (res.code === ImageStorageCodes.UPLOAD_IMAGE_FAILED) {
            throw new ProfileUploadAvatarException();
        }
        await this.updateProfile({
            uid: input.uid,
            avatar: res.data.url
        } as UpdateProfileInput)
        return res.data
    }
}