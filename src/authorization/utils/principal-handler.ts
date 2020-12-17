import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ActionType, DECORATOR_ACTION, DECORATOR_RESOURCE_HANDLER, PolicyActionType, PRINCIPAL_HEADER_FIELD } from "../consts";
import { AuthData, PrincipalHandler } from "../interfaces";
import { ResourceHandler } from "../interfaces/auth-metadata";


@Injectable()
export class DefaultPrincipalHandler implements PrincipalHandler {

    constructor(
        private readonly reflector: Reflector
    ) {
    }

    getPrincipal(context: ExecutionContext): AuthData {
        const req = context.switchToHttp().getRequest() as Request;
        const entityAction = this.reflector.get<string[]>(DECORATOR_ACTION, context.getHandler());

        if (!entityAction) {
            return null;
        }

        const [name, type] = entityAction;

        const resourceHandler = this.reflector.get<ResourceHandler>(
            DECORATOR_RESOURCE_HANDLER,
            context.getHandler()
        ) ?? (req => req.headers["qw-resource-id"]);

        const [entityName, action] = name.split(".");
        if (!entityName || !action) {
            return null;
        }

        if (type === ActionType.role) {
            return {
                principal_id: req.headers[PRINCIPAL_HEADER_FIELD] as string,
                entity_name: entityName,
                action_name: action,
                type: type
            }
        }

        return {
            principal_id: req.headers[PRINCIPAL_HEADER_FIELD] as string,
            entity_name: entityName,
            action_name: action,
            type: type as PolicyActionType,
            resources: resourceHandler(req)
        }
    }
}