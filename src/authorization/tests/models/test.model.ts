import { Model } from "mongoose";

export class TestDb {
    startSession() {
        return Promise.resolve(new TestSession());
    }

    endSession() {}
}

export class TestSession {
    startTransaction() {
        return Promise.resolve({});
    }
    abortTransaction() {
        return Promise.resolve({});
    }
    commitTransaction() {
        return Promise.resolve({});
    }
}


export class TestModel {

    db: TestDb = new TestDb();

    toObject(options?: any) { return null; }

    constructor(docs: any) {}
}

