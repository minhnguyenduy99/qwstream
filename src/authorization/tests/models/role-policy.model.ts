import { TestModel } from "./test.model";


export class TestRolePolicyModel extends TestModel{
    create(doc: any): Promise<any> {
        return Promise.resolve({});
    }

    updateOne(condition: any, doc: any): Promise<any> {
        return Promise.resolve({});
    }

    insertMany(docs: any[], options: any): Promise<any> {
        return Promise.resolve({});
    }


    aggregate(aggregates: any[]): Promise<any> {
        return Promise.resolve({});
    }

    findOne(condition: any, projection: any = {}): Promise<any> {
        return Promise.resolve({});
    }
}