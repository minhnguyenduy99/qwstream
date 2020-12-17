import { TestModel } from "./test.model";


export class TestEntityPolicyModel extends TestModel{

    insertMany(docs: any[], options: any): Promise<any> {
        return Promise.resolve({});
    }
}