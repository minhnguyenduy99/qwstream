import { ModuleMetadata } from "@nestjs/common";


/**
 * A custom option to dynamically provide roles
 */
export interface AuthRoleProvider extends Pick<ModuleMetadata, "imports"> {
    inject?: any[];
    useFactory: (...args: any[]) => String[] | Promise<String[]>;
}

/**
 * Options applied to the authorization core module
 */
export interface AuthCoreRootOptions {
    /**
     * The list of roles to provide for the application
     */
    roles?: String[] | AuthRoleProvider;
}
