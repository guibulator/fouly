import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class CosmosDbMongoApiService {
  private url: string;
  private dbName: string;
  private colName: string;

  constructor() {}

  init(url: string, dbName: string, colName: string) {
    this.url = url;
    this.dbName = dbName;
    this.colName = colName;
  }

  createUpdateObject(query: any, obj: any): void {
    const updateCmd = async (client: any) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      collection.updateOne(
        query,
        {
          $set: obj
        },
        { upsert: true },
        function(err, doc: any) {
          if (err) {
            console.log(`Error createOrUpdate : ${err}`);
          }
        }
      );
    };

    this.executeDbCmd(updateCmd);
  }

  getOneObject(query: any, callback: any): void {
    const queryCmd = async (client) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      const cursor = await collection.findOne(query);
      callback(null, cursor);
    };

    this.executeDbCmd(queryCmd);
  }

  deleteObjects(query: any, callback: any): void {
    const deleteCmd = async (client) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      collection.deleteMany(query, function(err, res) {
        callback(err, res);
      });
    };

    this.executeDbCmd(deleteCmd);
  }

  private async executeDbCmd(callback: any) {
    const client = await MongoClient.connect(this.url, { useNewUrlParser: true }).catch((err) => {
      console.log(err);
    });
    if (!client) {
      return;
    }

    try {
      callback(client);
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  }
}
