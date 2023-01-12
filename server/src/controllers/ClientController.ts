import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

import db from "../config/db";
import { Collections } from "../enums/Collections";
import { Client } from "../types/client";
import { UserDocument } from "../types/user";

export class ClientController {
  private _usersCollection = db.getDb().collection<UserDocument>(Collections.USERS)

  async addNew(client: Omit<Client, "created_at" | "id">, userId: string): Promise<Client> {
    const id = uuidv4()
    const created_at = new Date()
    const newClient = { ...client, id, created_at }

    await this._usersCollection.updateOne({ _id: new ObjectId(userId) }, {
      $push: { clientList: newClient }
    })

    return newClient
  }

  async findAll(userId: string) {
    const user = await this._usersCollection.findOne({ _id: new ObjectId(userId) })

    return user?.clientList
  }

  async findOne(clientId: string, userId: string) {
    const user = await this._usersCollection.findOne({ _id: new ObjectId(userId) })

    return user?.clientList.filter(c => c.id === clientId)[0]
  }

  async updateOne(client: Partial<Client>, userId: string) {
    const user = await this._usersCollection.findOne({ _id: new ObjectId(userId) })
    let newClient: Client | undefined

    const newClientList = user?.clientList.map(c => {
      if(c.id === client.id) {
        const { id, created_at, ...clientRest } = client
        newClient = { ...c, ...clientRest }
        return newClient
      }

      return c
    })

    await this._usersCollection.updateOne({ _id: new ObjectId(userId) }, { 
      $set: {
        clientList: newClientList
      }
    })

    return newClient
  }

  async delete(clientId: string, userId: string) {
    return await this._usersCollection.updateOne({ _id: new ObjectId(userId) }, {
      $pull:{
        clientList: {
          id: clientId
        }
      }
    })
  }
}