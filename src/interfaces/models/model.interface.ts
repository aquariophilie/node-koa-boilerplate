import { ErrorObject } from 'ajv';
import { Collection, DeleteResult, Document, InsertManyResult, UpdateResult, WithId } from 'mongodb';

export interface IModel<TSchema extends Document> {
    readonly collection: Promise<Collection<TSchema>>;
    readonly validatorErrors: null | ErrorObject[];
    validate(data: TSchema): any;
    findAll(): Promise<WithId<TSchema>[]>;
    findOne(id: string): Promise<WithId<TSchema> | null>;
    findMany(idList: string[]): Promise<WithId<TSchema>[]>;
    deleteOne(id: string): Promise<DeleteResult>;
    insert(data: TSchema): Promise<TSchema>;
    insertMany(data: TSchema[]): Promise<InsertManyResult>;
    update(id: string, data: any): Promise<UpdateResult>;
    deleteMany(idList: string[]): Promise<DeleteResult>;
    count(): Promise<any>;
}
