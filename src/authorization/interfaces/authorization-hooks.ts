import { PrincipalDTO } from "../models";
import { IAuthorizationService } from "./authorization-service";


export interface IAuthorizationHook {

    onPrincipalCreated(principal: PrincipalDTO, authService: IAuthorizationService): Promise<void>;
    
    onPrincipalRemoved(authService: IAuthorizationService): Promise<void>;
}


export interface OnPrincipalCreated extends Pick<IAuthorizationHook, "onPrincipalCreated"> {}
export interface OnPrincipalRemoved extends Pick<IAuthorizationHook, "onPrincipalRemoved"> {}