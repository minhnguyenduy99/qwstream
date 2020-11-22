import { BadRequestException, HttpStatus, Inject, Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GoogleCredential } from "./auth.config";
import { RefreshTokenInfo } from "./auth.interfaces";
import { GoogleAuth } from "./auth.model";
import authClient from "./google-auth";
import CONSTS from "./consts";


@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private readonly AUTH_ID: string = "google_auths";

  constructor(
    @InjectModel(GoogleAuth.name) private authModel: Model<GoogleAuth>,
    @Inject(CONSTS.CREDENTIALS) private credentials: GoogleCredential
  ) {
    authClient.initAuth(this.credentials);
    authClient.googleAuth2().on("tokens", async (tokens) => {
      if (tokens.refresh_token) {
        console.log("Refresh_token is set");
        await this.authModel.updateOne({
          auth_id: this.AUTH_ID
        }, {
          $set: {
            refresh_token: tokens.refresh_token,
            expired_date: tokens.expiry_date
          }
        })
      }
    });
  }
  
  async onModuleInit() {
    await this.authModel.updateOne({
      auth_id: this.AUTH_ID
    },{
      $set: {
        refresh_token: null,
        expired_date: 0
      }
    }, {
      upsert: true
    });
  }

  async getAccessToken() {
    try {
      const { res, token } = await authClient.googleAuth2().getAccessToken();
      if (res) {
        if (res.status !== HttpStatus.OK) {
          console.log(res.data);
          throw new BadRequestException({ 
            message: "Authorized required"
          })
        }
      }
      return token;
    }
    catch (err) {
      throw new BadRequestException({
        message: "Authorization required"
      })
    }
  }

  async getRefreshTokenInfo(): Promise<RefreshTokenInfo> {
    const auth = await this.authModel.findOne({
      auth_id: this.AUTH_ID
    });
    // refresh_token is still valid
    if (Date.now() - auth.expired_date <= 0) {
      return {
        token: auth.refresh_token,
        isExpired: false
      }
    }
    return {
      token: auth.refresh_token,
      isExpired: true
    }
  }

  async getAccessTokenWithCode(code: string) {
    const googleAuth = authClient.googleAuth2();
    const { res, tokens } = await googleAuth.getToken(code);
    if (res.status === HttpStatus.BAD_REQUEST) {
      throw new InternalServerErrorException();
    }
    googleAuth.setCredentials(tokens);
    return tokens.access_token;
  }

  getAuthClient() {
    return authClient.googleAuth2();
  }

  getAuthURL() {
    return authClient.getAuthURL();
  }
}