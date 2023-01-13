import bcrypt from 'bcrypt'

import db from "../config/db";
import { Collections } from "../enums/Collections";
import { UserDocument } from "../types/user";
import { AuthController } from "./AuthController";
import { ObjectId } from "mongodb";

interface LoginResponse {
  accessToken: string,
  refreshToken: string,
  user: Omit<UserDocument, "password">
}

interface CreateResponse extends LoginResponse {}

const saltRounds = 10;

export class UserController {
  private _usersCollection = db.getDb().collection<UserDocument>(Collections.USERS)

  async login(username: string, password: string): Promise<LoginResponse | undefined> {
    const user = await this._usersCollection.findOne({ username })
    if(!user) return

    const match = await bcrypt.compare(password, user.password);
    if(!match) return

    const authController = new AuthController
    const refreshToken = authController.generateRefreshToken({}, { subject: String(user._id) })
    
    await authController.storeRefreshToken(refreshToken)

    const { password: p, ...userRest } = user

    return {
      accessToken: authController.generateAccessToken({}, { subject: String(user._id) }),
      refreshToken,
      user: userRest
    }
  }

  async create(user: Omit<UserDocument, "clientList">): Promise<CreateResponse> {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)

    const newUser: UserDocument = {
      ...user,
      clientList: [],
      password: hashedPassword
    }
    const { insertedId } = await this._usersCollection.insertOne(newUser)

    const authController = new AuthController
    const refreshToken = authController.generateRefreshToken({}, { subject: String(insertedId) })
    
    await authController.storeRefreshToken(refreshToken)

    const { password, ...newUserRest} = newUser

    return {
      accessToken: authController.generateAccessToken({}, { subject: String(insertedId) }),
      refreshToken,
      user: newUserRest
    }
  }

  async isUsernameInUse(username: string): Promise<boolean> {
    return !!(await this._usersCollection.findOne({ username }))
  }

  async findOne(id: string) {
    const user = await this._usersCollection.findOne({ _id: new ObjectId(id) })
    if(user) {
      const { password, ...userRest } = user
      return userRest
    }
  }

  async find(limit?: number) {
    // .limit(0) is equivalent to setting no limit.
    limit = limit ? limit : 0
    const users = await this._usersCollection.find().limit(limit).toArray()
    const usersWithoutPassword = users.map(user => {
      const { password, ...userRest } = user

      return userRest
    })
    return usersWithoutPassword
  }
}