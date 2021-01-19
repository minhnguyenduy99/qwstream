import { Logger } from "@nestjs/common";
import { Console } from "inspector";
import { LookupOptions } from "./interfaces";

export class AggregateBuilder {

    protected _aggregates: any[];

    constructor() {
        this._aggregates = [];
    }

    match(obj) {
        if (!obj) {
            return this;
        }
        const $match = {
            $match: obj
        };
        this._aggregates.push($match);
        return this;
    }

    sort(obj) {
        if (!obj) {
            return this;
        }
        const $sort = {
            $sort: obj
        };
        this._aggregates.push($sort);
        return this;
    }

    lookup(option: LookupOptions) {
        let {
            from: _from,
            as,
            localField,
            foreignField,
            removeFields = [],
            single = true
        } = option;
        let from = _from.collection.collectionName;
        const $project = removeFields?.reduce((pre, cur) => ({ 
            ...pre,
            [cur]: 0
        }), {});
        const $lookup = {
            from,
            let: {
                local_field: `$${localField}`
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [`$$local_field`, `$${foreignField}`]
                        }
                    }
                },
                {
                    $project
                }
            ],
            as
        }
        let $replaceRoot = null;
        if (single) {
            $replaceRoot = { 
                newRoot: { 
                    $mergeObjects: [
                        "$$ROOT",
                        { 
                            [localField]: { $arrayElemAt: [ `$${as}`, 0 ] }
                        }
                    ] 
                }
            }
        }
        this._aggregates.push(
            { $lookup },
            { $replaceRoot }
        );
        console.log()
        return this;
    }

    removeFields(fields: string[]) {
        const [, last] = this._aggregates;
        const newProjects = fields?.reduce((pre, cur) => ({ 
            ...pre,
            [cur]: 0
        }), {}) as any;
        if (last.$project) {
            last.$project = {
                ...last.$project,
                ...newProjects
            }
        } else {
            this._aggregates.push({
                $project: newProjects
            });
        }
        return this;
    }

    log<T extends { log(...data: any[]): void }>(logger: T) {
        (logger ?? console).log(this._aggregates);
        return this;
    }

    build() {
        let result = [...this._aggregates];
        this._aggregates.length = 0;
        return result;
    }
}