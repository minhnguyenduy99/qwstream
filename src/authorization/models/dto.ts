import { EntityPolicy } from "./entity-policy.model";
import { PrincipalPolicy } from "./principal-policy.model";
import { Principal } from "./principal.model";
import { RoleActionPolicy } from "./role-action-policy.model";
import { RolePolicy } from "./role-policy.model";
import { Role } from "./role.model";



export interface PrincipalDTO extends Partial<Pick<Principal, 
    "principal_id" | "role_name">> {}

export interface PrincipalPolicyDTO extends Partial<Pick<PrincipalPolicy, 
    "principal_id" | "action_name" | "resources">> {}

export interface RoleDTO extends Partial<Pick<Role, 
    "role_name">> {}

export interface EntityPolicyDTO extends Partial<Pick<EntityPolicy, 
    "entity_name" | "policy_name" | "actions" | "isAllowedAll">> {}

export interface RolePolicyDTO extends Partial<Pick<RolePolicy,
    "role_name" | "entity_name" | "entity_policy_name">> {
    entity_policy?: EntityPolicyDTO;
}

export interface RoleActionPolicyDTO extends Partial<Pick<RoleActionPolicy, 
    "role_name" | "entity_name" | "action_name">> {}

