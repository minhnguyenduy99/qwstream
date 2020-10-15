import { Validate } from "class-validator";
import { ObjectIdFormat } from "@helpers/validation";

// defines query and params type (if necessary)

export class FindUserQuery {
    @Validate(ObjectIdFormat)
    user_id: string;

    @Validate(ObjectIdFormat)
    profile_id: string;
}