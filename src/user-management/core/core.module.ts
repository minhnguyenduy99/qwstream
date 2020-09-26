import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Profile, ProfileSchema } from "./core.profile.model";
import { User, UserSchema } from "./core.user.model";
import { UserCommitService } from "./core.UserCommitService.service"


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Profile.name, schema: ProfileSchema },
            { name: User.name, schema: UserSchema },
        ])
    ],
    providers: [UserCommitService],
    exports: [UserCommitService]
})
export default class CoreModule {
}