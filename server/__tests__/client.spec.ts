import { authorizationHeader, fakeClient, fakeClient2, fakeUser } from "../tests/config"
import { request } from "../tests/setup"

describe("client routes", () => {

  it("should create a client", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)
    
     const createClientResponse = await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))

      expect(createClientResponse.body).toHaveProperty('id')
      expect(createClientResponse.status).toBe(201)
  })

  it("should get all clients from a user", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)
    
     await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))
    
     await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))

      const getAllResponse = await request
        .get('/clients')
        .set(authorizationHeader(createUserResponse.body.accessToken))

    expect(Array.isArray(getAllResponse.body)).toBe(true)
    expect(getAllResponse.body.length).toBe(2)
  })

  it("should get a specific client", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)
    
    const createClientResponse = await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    const fetchAClient = await request
      .get(`/clients/${createClientResponse.body.id}`)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    expect(fetchAClient.body.id).toBe(createClientResponse.body.id)
  })

  it("should get 'Client not found' error in the fetch route", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const fetchAClient = await request
      .get(`/clients/fakeId`)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    expect(fetchAClient.body.message).toBe('Client not found')
    expect(fetchAClient.status).toBe(404)
  })

  it("should a update a specific client", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const createClientResponse = await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    const updateResponse = await request
      .patch(`/clients/${createClientResponse.body.id}`)
      .set(authorizationHeader(createUserResponse.body.accessToken))
      .send(fakeClient2)

    expect(updateResponse.body.name).toBe(fakeClient2.name)
    expect(updateResponse.body.cpf).toBe(fakeClient2.cpf)
  })

  it("should get a 'Client not found' error in the update route", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const updateResponse = await request
      .patch(`/clients/fakeId`)
      .set(authorizationHeader(createUserResponse.body.accessToken))
      .send(fakeClient2)

    expect(updateResponse.body.message).toBe('Client not found')
    expect(updateResponse.status).toBe(404)
  })


  it("should delete a specific client", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const createClientResponse = await request
      .post('/clients')
      .send(fakeClient)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    const deleteResponse = await request
      .delete(`/clients/${createClientResponse.body.id}`)
      .set(authorizationHeader(createUserResponse.body.accessToken))
      .send(fakeClient2)

    expect(deleteResponse.body.message).toBe('Successfully deleted')

    const fetchAClient = await request
      .get(`/clients/${createClientResponse.body.id}`)
      .set(authorizationHeader(createUserResponse.body.accessToken))

    expect(fetchAClient.body.message).toBe('Client not found')
    expect(fetchAClient.status).toBe(404)
  })

})