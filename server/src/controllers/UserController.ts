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
    // Check if user exists
    const user = await this._usersCollection.findOne({ username })
    if(!user) return

    // Check if passwords match
    const match = await bcrypt.compare(password, user.password);
    if(!match) return

    // Generate refresh token and access token
    const authController = new AuthController
    const refreshToken = authController.generateRefreshToken({}, { subject: String(user._id) })
    const accessToken = authController.generateAccessToken({}, { subject: String(user._id) })
    
    // store refresh token
    await this.updateOne({ refreshToken }, String(user._id))

    // remove sensitive data
    const { password: p, refreshToken:rt, ...userRest } = user

    // return data
    return {
      accessToken,
      refreshToken,
      user: userRest
    }
  }

  async create(user: Omit<UserDocument, "clientList">): Promise<CreateResponse> {
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)

    // mount new user
    const newUser: UserDocument = {
      ...user,
      clientList: [],
      password: hashedPassword
    }

    // insert new user
    const { insertedId } = await this._usersCollection.insertOne(newUser)

    // generate access and refresh token
    const authController = new AuthController
    const refreshToken = authController.generateRefreshToken({}, { subject: String(insertedId) })
    const accessToken = authController.generateAccessToken({}, { subject: String(insertedId) })
    
    // store refresh token
    await this.updateOne({ refreshToken }, String(insertedId))

    // remove sensitive data
    const { password, refreshToken:rt, ...newUserRest} = newUser

    // return data
    return {
      accessToken,
      refreshToken,
      user: newUserRest
    }
  }

  async updateOne(newUser: Partial<Omit<UserDocument, "_id">>, id: string) {
    return await this._usersCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: { ...newUser }
    })
  }

  async isUsernameInUse(username: string): Promise<boolean> {
    return !!(await this._usersCollection.findOne({ username }))
  }

  async findOne(id: string) {
    const user = await this._usersCollection.findOne({ _id: new ObjectId(id) })
    if(user) {
      const { password, refreshToken, ...userRest } = user
      return userRest
    }
  }

  async find(limit?: number) {
    // .limit(0) is equivalent to setting no limit.
    limit = limit ? limit : 0
    const users = await this._usersCollection.find().limit(limit).toArray()

    // remove sensitive data
    const usersWithoutSensitiveData = users.map(user => {
      const { password, refreshToken, ...userRest } = user

      return userRest
    })

    // return data
    return usersWithoutSensitiveData
  }
}