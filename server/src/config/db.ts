import { Db, MongoClient,  } from "mongodb";

import { Collections } from "../enums/Collections";
import { UserDocument } from "../types/user";

const url = process.env.MONGODB_URL!;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);

let dbConnection: Db

const standardUsers: UserDocument[] = [
  { 
    username: 'desafiosharenergy',
    password: 'sh@r3n3rgy', 
    clientList: [] 
  },
  { 
    username: 'admin', 
    password: 'admin', 
    clientList: [] 
  },
]

export default {
  connectToServer: async () => {
    await client.connect()
    console.log('Connected successfully to server')
    dbConnection = client.db(dbName)

    const userCollection = dbConnection.collection<UserDocument>(Collections.USERS)
    
    standardUsers.forEach(async user => {
      const userAlreadyCreated = await userCollection.findOne({ username: user.username })

      if(!userAlreadyCreated) await userCollection.insertOne(user)
    })
    
    return 'done.'
  },
  getDb: () => dbConnection,
  close: client.close
}