import { Model } from "mongoose";
import { TestModel } from "./test.model";



export class TestPrincipalModel extends TestModel {
    create(doc: any): Promise<any> {
        return Promise.resolve({});
    }

    aggregate(aggregates: any[]): Promise<any> {
        return Promise.resolve({});
    }

    findOne(condition: any, projection?: any): Promise<any> {
        return Promise.resolve({});
    }
}