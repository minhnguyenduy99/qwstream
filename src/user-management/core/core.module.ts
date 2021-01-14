import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EncryptModule } from "@services/encrypt";
import { AppService } from "src/app.service";
import { ImageStorageModule } from "src/services/image-storage";
import { Profile, ProfileSchema } from "./core.profile.model";
import { ProfileCommitService } from "./core.ProfileCommitService.service";
import { ProfileQueryService } from "./core.ProfileQueryService.service";
import { User, UserSchema } from "./core.user.model";
import { UserCommitService } from "./core.UserCommitService.service"
import { UserQueryService } from "./core.UserQueryService.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Profile.name, schema: ProfileSchema },
            { name: User.name, schema: UserSchema },
        ]),
        EncryptModule,
        ImageStorageModule.forFeature({
            albumName: "Profile Avatar",
            defaultImage: {
                useFactory: (appService: AppService) => {
                    const result = `${appService.publicURL}/images/customer_default.png`;
                    return result;
                },
                inject: [AppService]
            }
        })
    ],
    providers: [UserCommitService, UserQueryService, ProfileQueryService, ProfileCommitService],
    exports: [UserCommitService, UserQueryService, ProfileQueryService, ProfileCommitService]
})

export default class UserModule {
}