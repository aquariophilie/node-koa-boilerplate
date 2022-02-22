import { inject, injectable } from 'inversify';
import { Collection, Db, DeleteResult, Document, Filter, InsertManyResult, ObjectId, OptionalUnlessRequiredId, UpdateResult, WithId } from 'mongodb';
import { ErrorObject, ValidateFunction } from 'ajv';

import { MongoDBClient } from '../loaders/mongo-client';
import { TYPES } from '../types';
import { IModel } from '../interfaces/models/model.interface';

@injectable()
export abstract class Model<TSchema extends Document> implements IModel<TSchema> {

    protected validator: ValidateFunction | undefined;
    protected collectionName: string;

    constructor(
        @inject(TYPES.MongoClient) protected mongo: MongoDBClient,
    ) {
    }

    get validatorErrors(): null | ErrorObject[] {
        return this.validator.errors;
    }

    get db(): Promise<Db> {
        return this.mongo.getDb();
    }

    get collection(): Promise<Collection<TSchema>> {
        return this.db.then((val) => val.collection<TSchema>(this.collectionName));
    }

    public validate(data: TSchema) {
        const res = this.validator(data);
        return res;
    }

    public async findAll(): Promise<WithId<TSchema>[]> {
        return (await this.collection).find().toArray();
    }

    public async findOne(id: string): Promise<WithId<TSchema> | null> {
        return (await this.collection).findOne({ _id: new ObjectId(id) as Filter<TSchema> });
    }

    public async findMany(idList: string[]): Promise<WithId<TSchema>[]> {
        const objects = idList.map((value) => new ObjectId(value)) as any[];
        return (await this.collection).find({ _id: { $in: objects } }).toArray();
    }

    public async deleteOne(id: string): Promise<DeleteResult> {
        const result = await (await this.collection).deleteOne({ _id: new ObjectId(id) as Filter<TSchema> });
        return result;
    }

    public async deleteMany(idList: string[]): Promise<DeleteResult> {
        const objects = idList.map((value) => new ObjectId(value)) as any[];
        const result = await (await this.collection).deleteMany({ _id: { $in: objects } });
        return result;
    }

    public async insert(data: TSchema): Promise<TSchema> {
        const result = await (await this.collection).insertOne(data as OptionalUnlessRequiredId<TSchema>);
        if (!result.insertedId) {
            throw Error('No id for result');
        }
        Object.assign(data, { _id: result.insertedId });
        return data;
    }

    public async insertMany(data: TSchema[]): Promise<InsertManyResult> {
        const result = await (await this.collection).insertMany(data as OptionalUnlessRequiredId<TSchema>[]);
        return result;
    }

    public async update(id: string, data: any): Promise<UpdateResult> {
        const result = await (await this.collection).updateOne({ _id: new ObjectId(id) as Filter<TSchema> }, { $set: data });
        return result;
    }

    public async count(): Promise<any> {
        return (await this.collection).countDocuments();
    }

}
