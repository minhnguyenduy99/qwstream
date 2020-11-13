import { AutoIDGenerator } from "./model";



export function generateIDMiddleware(idField: string, tableName) {
    return async function() {
        const modelInstance = this.model(AutoIDGenerator.name);
        try {
            const tableInfo = await modelInstance.findOneAndUpdate({
                table_name: tableName
            }, {
                $inc: {
                    sequence: 1
                }
            }, {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true,
                useFindAndModify: false
            });
            this[idField] = tableInfo.sequence;
        } catch (err) {
            console.log(err);
        }
    }
}