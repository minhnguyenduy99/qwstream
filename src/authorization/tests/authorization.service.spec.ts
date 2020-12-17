import { Logger } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { InvalidActionException, InvalidPrincipalException, InvalidRoleAssignException, InvalidRolePolicyException, RolePolicyActionDeniedException } from "../errors";
import { EntityPolicy, Principal, PrincipalDTO, PrincipalPolicy, Role, RoleActionPolicy, RolePolicy, RolePolicyDTO } from "../models";
import { AuthorizationService } from "../services";
import { TestRoleModel, TestRolePolicyModel, TestPrincipalModel, TestPrincipalPolicyModel, TestEntityPolicyModel, TestModel, TestRoleActionPolicyModel } from "./models";


describe("authorizationService", () => {
    let authService: AuthorizationService;
    let roleModel: TestRoleModel;
    let rolePolicyModel: TestRolePolicyModel;
    let entityPolicyModel: TestEntityPolicyModel;
    let roleActionPolicyModel: TestRoleActionPolicyModel;
    let principalModel: TestPrincipalModel;
    let principalPolicyModel: TestPrincipalPolicyModel;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthorizationService,
                {
                    provide: getModelToken(Role.name),
                    useClass: TestRoleModel
                },
                {
                    provide: getModelToken(RolePolicy.name),
                    useClass: TestRolePolicyModel
                },
                {
                    provide: getModelToken(EntityPolicy.name),
                    useClass: TestEntityPolicyModel
                },
                {
                    provide: getModelToken(Principal.name),
                    useClass: TestPrincipalModel
                },
                {
                    provide: getModelToken(PrincipalPolicy.name),
                    useClass: TestPrincipalPolicyModel
                },
                {
                    provide: getModelToken(RoleActionPolicy.name),
                    useClass: TestRoleActionPolicyModel
                },
                {
                    provide: "LOGGER",
                    useValue: new Logger("TestAuthorization")
                }
            ]
        }).compile();

        authService = module.get(AuthorizationService);
        roleModel = module.get(getModelToken(Role.name));
        rolePolicyModel = module.get(getModelToken(RolePolicy.name));
        principalModel = module.get(getModelToken(Principal.name));
        principalPolicyModel = module.get(getModelToken(PrincipalPolicy.name));
        entityPolicyModel = module.get(getModelToken(EntityPolicy.name));
        roleActionPolicyModel = module.get(getModelToken(RoleActionPolicy.name));
    });

    it("[createPrincipal] with null param throws exception", async () => {
        expect.assertions(1);
        try {
            await authService.createPrincipal(null);
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidRoleAssignException);
        }
    });

    it("[createPrincipal] with null role_name and principal_id are null throws exception", async () => {
        expect.assertions(1);
        try {
            await authService.createPrincipal({ role_name: null, principal_id: null });
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidRoleAssignException);
        }
    });

    it("[createPrincipal] with `role_name` is null throws exception", async () => {
        expect.assertions(1);
        try {
            let options = { role_name: null, principal_id: "testid" };
            await authService.createPrincipal(options);
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidRoleAssignException);
        }
    });

    it("[createPrincipal] with `principal_id` is null throws exception", async () => {
        expect.assertions(1);
        try {
            let options = { role_name: "guest", principal_id: null };
            await authService.createPrincipal(options);
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidRoleAssignException);
        }
    });

    it("[createPrincipal] non-exist role name throws error", async () => {
        expect.assertions(1);
        let options = { role_name: "guest", principal_id: "123" };
        jest.spyOn(roleModel, "findOne").mockResolvedValue(null);
        try {
            await authService.createPrincipal(options);
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidRoleAssignException);
        }
    });

    it("[createPrincipal] persist data failed return null", async () => {
        expect.assertions(1);

        let requestedRole = { role_name: "guest" };
        let options = { role_name: "guest", principal_id: "123" };
        let expectedPrincipal = new TestModel({ role_name: "guest", principal_id: "123" });

        
        jest.spyOn(roleModel, "findOne")
            .mockResolvedValue(requestedRole);

        jest.spyOn(principalModel, "create")
            .mockResolvedValue(expectedPrincipal);
            
        jest.spyOn(expectedPrincipal, "toObject")
            .mockReturnValue(expectedPrincipal);
        
        jest.spyOn(authService, "persistPrincipal").mockResolvedValue(null);

        const result = await authService.createPrincipal(options);

        expect(result).toEqual(null);
    });

    it("[createPrincipalPolicy] Non-existent principal throws exception", async () => {
        expect.assertions(2);

        let options = {
            principal_id: "123",
            entity_name: "testEntity",
            action_name: "testAction",
            resources: []
        };

        const findPrincipalSpy = jest
            .spyOn(principalModel, "findOne")
            .mockResolvedValue(null);

        try {
            await authService.createPrincipalPolicy(options);
        } catch (err) {
            expect(findPrincipalSpy).toHaveBeenCalled();
            expect(err).toBeInstanceOf(InvalidPrincipalException);
        }
    });

    it("[createPrincipalPolicy] Non-existent role policy throws exception", async () => {
        expect.assertions(3)

        let options = {
            principal_id: "123",
            entity_name: "fakeEntity",
            action_name: "testAction",
            resources: []
        };

        let exisingPrincipal = {
            principal_id: "123",
            role_name: "guest"
        } as PrincipalDTO;

        const findPrincipalSpy = jest.spyOn(principalModel, "findOne")
            .mockResolvedValue(exisingPrincipal);
            
        const findRolePolicySpy = jest.spyOn(authService, "findRolePolicy")
            .mockResolvedValue(null);
        
        try {
            await authService.createPrincipalPolicy(options);
        } catch (err) {
            expect(findPrincipalSpy).toHaveBeenCalled();
            expect(findRolePolicySpy).toHaveBeenCalled();
            expect(err).toBeInstanceOf(InvalidRolePolicyException);
        }
    });

    it("[createPrincipalPolicy] Invalid action in role policy throws exception", async () => {
        expect.assertions(4);

        let options = {
            principal_id: "123",
            entity_name: "testPolicy",
            action_name: "fakeAction",
            resources: []
        };

        let exisingPrincipal = {
            principal_id: "123",
            role_name: "guest"
        } as PrincipalDTO;


        let exitingRolePolicy = {
            entity_policy: {
                isAllowedAll: false,
                actions: ["testAction1", "testAction2"]
            }
        } as RolePolicyDTO;

        const findPrincipalSpy = jest.spyOn(principalModel, "findOne")
        .mockResolvedValue(exisingPrincipal);
        
        const findRolePolicySpy = jest.spyOn(authService, "findRolePolicy")
        .mockResolvedValue(exitingRolePolicy);

        const doesActionExistSpy = jest.spyOn(authService, "doesActionExist")
        .mockReturnValue(false);

        try {
            await authService.createPrincipalPolicy(options);
        } catch (err) {
            expect(findPrincipalSpy).toHaveBeenCalled();
            expect(findRolePolicySpy).toHaveBeenCalled();
            expect(doesActionExistSpy).toHaveBeenCalled();
            expect(err).toBeInstanceOf(InvalidActionException);
        }
    });


    it("[createPrincipalPolicy] Principal policy has already exists - throws exception", async () => {
        expect.assertions(4);

        let options = {
            principal_id: "123",
            entity_name: "testPolicy",
            action_name: "testAction1",
            resources: []
        };

        let exisingPrincipal = {
            principal_id: "123",
            role_name: "guest"
        } as PrincipalDTO;


        let exitingRolePolicy = {
            entity_policy: {
                isAllowedAll: false,
                actions: ["testAction1", "testAction2"]
            }
        } as RolePolicyDTO;

        const findPrincipalSpy = jest.spyOn(principalModel, "findOne")
        .mockResolvedValue(exisingPrincipal);
        
        const findRolePolicySpy = jest.spyOn(authService, "findRolePolicy")
        .mockResolvedValue(exitingRolePolicy);

        const doesActionExistSpy = jest.spyOn(authService, "doesActionExist")
        .mockReturnValue(true);

        jest.spyOn(principalPolicyModel, "create")
            .mockRejectedValue(new InvalidPrincipalException());

        try {
            await authService.createPrincipalPolicy(options);
        } catch (err) {
            expect(findPrincipalSpy).toHaveBeenCalled();
            expect(findRolePolicySpy).toHaveBeenCalled();
            expect(doesActionExistSpy).toHaveBeenCalled();
            expect(err).toBeInstanceOf(InvalidPrincipalException);
        }
    });

    it("[createRoleActionPolicy] Invalid principal - throws exception", async () => {
        expect.assertions(2);

        let options = {
            principal_id: "123",
            entity_name: "testPolicy",
            action_name: "testAction1",
            resources: []
        };

        const findPrincipalSpy = jest.spyOn(principalModel, "findOne")
        .mockResolvedValue(null);
        
        try {
            await authService.createRoleActionPolicy(options);
        } catch (err) {
            expect(findPrincipalSpy).toHaveBeenCalled();
            expect(err).toBeInstanceOf(InvalidPrincipalException);
        }
    });

    
    it("[createRoleActionPolicy] Create successfully", async () => {
        expect.assertions(2);

        let options = {
            principal_id: "123",
            entity_name: "testPolicy",
            action_name: "testAction1",
            resources: []
        };
        
        let principal = {
            principal_id: "123",
            role_name: "test role name"
        }

        const findPrincipalSpy = jest.spyOn(principalModel, "findOne")
            .mockResolvedValue(principal);

        const updateRoleActionSpy = jest.spyOn(roleActionPolicyModel, "updateOne")
            .mockResolvedValue(null);
        
        await authService.createRoleActionPolicy(options);

        expect(findPrincipalSpy).toHaveBeenCalled();
        expect(updateRoleActionSpy).toHaveBeenCalled();
    });
});