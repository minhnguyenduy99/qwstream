import { applyDecorators, SetMetadata } from "@nestjs/common";
import { DECORATOR_METHOD_TAG, MethodTagValues } from "../consts";


/**
 * Exclude the authorization on method.
 */
export function NonAuthorize(): MethodDecorator {

    let decorators = [];

    decorators.push(SetMetadata(DECORATOR_METHOD_TAG, MethodTagValues.Nonauthorize));

    return applyDecorators(...decorators);
}