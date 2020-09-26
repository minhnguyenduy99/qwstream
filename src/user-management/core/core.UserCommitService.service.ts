import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserInput } from "./core.dto";
import { User } from "./core.user.model";



@Injectable()
export class UserCommitService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }


    createUser(input: CreateUserInput) {
        throw new NotImplementedException();
    }
}