import { injectable } from 'inversify';
import { MongoDBConnection } from './mongo-connection';

@injectable()
export class MongoDBClient {

    public async getDb() {
        return MongoDBConnection.getConnection();
    }

}
