import { applyDecorators, SetMetadata } from "@nestjs/common";
import { DECORATOR_ENTITY, DECORATOR_METHOD_TAG, DECORATOR_ACTION, ActionType, MethodTagValues } from "../consts";
import { ClassAuthMetadata } from "../interfaces";
import { AuthorizeMethod } from "./authorize-method.decorator";


/**
 * Set metadata for the class authorization.
 * 
 * By default, the `AuthorizeMethod` is automatically applied on all the methods 
 * with default options if it is not explicitly applied.
 * 
 * @param metadata
 */
export function AuthorizeClass(metadata: ClassAuthMetadata): ClassDecorator {
    if (!metadata) {
        return;
    }

    let {
        entity,
        resourceHandler
    } = metadata;

    let decorators = [];
    decorators.push(SetMetadata(DECORATOR_ENTITY, entity));

    decorators.push((f) => {  
        const descriptors = Object.getOwnPropertyDescriptors(f.prototype);
        if (!entity) {
            return;
        }

        Object.keys(descriptors).forEach(key => {
            if (key === "constructor") {
                return;
            }
            const descriptor = descriptors[key] as PropertyDescriptor;
            const method = descriptor.value;
            if (typeof method !== "function") {
                return;
            }
            let methodTag = Reflect.getMetadata(DECORATOR_METHOD_TAG, descriptor.value);
            let action = Reflect.getMetadata(DECORATOR_ACTION, descriptor.value);
            let fullAction = [`${entity}.${action?.[0] ?? method.name}`, action?.[1] ?? ActionType.role];
            
            switch (methodTag) {
                case MethodTagValues.Nonauthorize: return;
                case MethodTagValues.Authorize: {
                     // Modify permission
                    Reflect.defineMetadata(DECORATOR_ACTION, fullAction, method);
                    return;
                };
                default: {
                    applyDecoratorsOnTarget(method, AuthorizeMethod({ action: fullAction[0], type: fullAction[1], resourceHandler }));
                }
            }
        });
    })

    return applyDecorators(...decorators);
}



function applyDecoratorsOnTarget(target: any, decorators: any) {
    return decorators(target);
}
