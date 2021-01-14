import { CallHandler, ExecutionContext, NestInterceptor, Optional, Type } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { StreamAuthFactory } from "./interfaces";
import { RestAuthFactory } from "./factory.rest-auth";


export class StreamAuthInterceptor implements NestInterceptor {

    protected factory: StreamAuthFactory;

    constructor(@Optional() authFactory: StreamAuthFactory | Type<StreamAuthFactory>, ...args) {
        if ((authFactory as StreamAuthFactory).getBody === undefined) {
            const type = authFactory as Type<StreamAuthFactory>;
            this.factory = new type(args);
        } else {
            this.factory = authFactory as StreamAuthFactory;
            if (!this.factory) {
                this.factory = new RestAuthFactory();
            }
        }
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const http = context.switchToHttp();
        const req = http.getRequest() as Request;

        console.log(req.body);
        req.body = await Promise.resolve(this.factory.getBody(req));

        
        return next.handle();
    }
}