import { TestModel } from "./test.model";


export class TestRoleActionPolicyModel extends TestModel {
    updateOne(condition: any, doc: any): Promise<any> {
        return Promise.resolve({});
    }
}