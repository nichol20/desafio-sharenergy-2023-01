import { Db, MongoClient } from 'mongodb'
import supertest from 'supertest'

export let db: Db
let connection: MongoClient
export const request = supertest('http://localhost:5000')
export const agent = supertest.agent('http://localhost:5000')

beforeAll(async () => {
  connection = await MongoClient.connect(`mongodb://localhost:27017`)
  db = connection.db('desafio_sharenergy_test')
})

afterEach(async () => {
  //Cleaning database
  const collections = await db.collections()
  for(let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await connection.close()
})