import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptService } from "src/services/encrypt";
import { ProfileQueryService, UserQueryService } from "src/user-management/core";
import { AuthToken } from "./auth-token.model";
import { CONFIG_KEY } from "./config";
import { AccessTokenPayload, RefreshTokenPayload, UserData } from "./local-auth.interfaces";


@Injectable()
export class LocalAuthService {

    constructor(
        private readonly userService: UserQueryService,
        private readonly profileService: ProfileQueryService,
        private readonly encryptService: EncryptService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectModel(AuthToken.name) private readonly authTokenModel: Model<AuthToken>
    ) {}
    
    async validateUser(username: string, password: string) {
        const user = await this.userService.findUserByUsername(username);
        if (!user) {
            return null;
        }
        const passwordMatch = await this.encryptService.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        const profile = await this.profileService.findProfile(user.id);
        return this.extractUserData(user, profile);
    }

    async validateAccessTokenPayload(payload: AccessTokenPayload) {
        const user = await this.userService.findUserById(payload.uid);
        if (!user) {
            return null;
        }
        return this.extractUserData(user);
    }

    async validateRefreshTokenPayload(payload: RefreshTokenPayload) {
        const [user, authToken] = await Promise.all([
            this.userService.findUserById(payload.uid),
            this.authTokenModel.findOne({ user_id: payload.uid })
        ]);
        if (!user || !authToken) {
            return null;
        }
        if (user.id !== authToken.user_id) {
            return null;
        }
        return this.extractUserData(user);
    }

    async generateAccessToken(user: UserData) {
        const accessTokenPayload = {
            uid: user._id
        } as AccessTokenPayload;

        const accessToken = await this.jwtService.sign(accessTokenPayload, {
            secret: this.configService.get(CONFIG_KEY.accessTokenSecretKey),
            expiresIn: this.configService.get(CONFIG_KEY.accessTokenExpires),
        });
        return accessToken;
    }

    async generateRefreshToken(user: UserData) {
        const payload = {
            uid: user._id
        } as RefreshTokenPayload;
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get(CONFIG_KEY.refreshTokenSecretKey),
            expiresIn: this.configService.get(CONFIG_KEY.refreshTokenExpires),
        });
        const hashRefreshToken = await this.encryptService.hash(refreshToken);
        await this.authTokenModel.updateOne({
            user_id: user._id
        }, {
            user_id: user._id,
            hash_refresh_token: hashRefreshToken 
        }, {
            upsert: true
        });
        return refreshToken;
    }

    protected extractUserData(user, profile?: any) {
        const { password, username, ...userData } = user?.toObject();
        return {
            ...userData,
            profile
        } as UserData;
    }
}