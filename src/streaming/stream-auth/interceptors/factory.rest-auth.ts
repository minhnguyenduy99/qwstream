import { StreamAuth, StreamAuthFactory } from "./interfaces";
import { Request} from "express";

export class RestAuthFactory implements StreamAuthFactory {
    getBody(req: Request): StreamAuth {
        return req.body;
    }
}