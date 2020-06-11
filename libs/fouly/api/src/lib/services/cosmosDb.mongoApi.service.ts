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

  async createUpdateObject(query: any, obj: any): Promise<any> {
    const updateCmd = async (client: any) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      await collection.updateOne(
        query,
        {
          $set: obj
        },
        { upsert: true },
        async function(err, doc: any) {
          console.log(doc.toJSON());
          const cursor = await collection.find(query);
          cursor.each(function(err, doc) {
            console.log(doc);
            client.close();
            return doc;
          });
        }
      );
    };

    return await this.executeDbCmd(updateCmd);
  }

  async getObjects(query: any): Promise<any[]> {
    const queryCmd = async (client) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      const cursor = await collection.find(query);
      let res: any;
      cursor.each(function(err, doc) {
        console.log(doc);
        if (doc) {
          res = doc;
          return res;
        }
      });
      client.close();
      //   return res;
    };

    return await this.executeDbCmd(await queryCmd);
  }

  async deleteObjects(query: any): Promise<any> {
    const deleteCmd = async (client) => {
      const db = client.db(this.dbName);
      const collection: any = db.collection(this.colName);
      return await collection.deleteMany(query);
    };

    return await this.executeDbCmd(deleteCmd);
  }

  private async executeDbCmd(cmd: any) {
    const client = await MongoClient.connect(this.url, { useNewUrlParser: true }).catch((err) => {
      console.log(err);
    });
    if (!client) {
      return;
    }

    try {
      return await cmd(client);
    } catch (err) {
      console.log(err);
    } finally {
      //   client.close();
    }
  }
}
