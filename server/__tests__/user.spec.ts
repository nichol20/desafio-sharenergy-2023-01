import { authorizationHeader, fakeUser } from "../tests/config"
import { request } from "../tests/setup"

describe("user routes", () => {

  it("should create a user", async () => {
    const response = await request
      .post('/users')
      .send(fakeUser)

    expect(response.body).toHaveProperty('accessToken')
    expect(response.body.user).toHaveProperty('_id')
    expect(response.status).toBe(201)
  }) 

  it("should get 'User already exists' error", async () => {
    const createReponse = await request
      .post('/users')
      .send(fakeUser)
    const createResponse2 = await request
      .post('/users')
      .send(fakeUser)

    expect(createResponse2.body.message).toBe('User already exists')
    expect(createResponse2.status).toBe(409)
  }) 

  it("should get 'Missing information' error ", async () => {
    const response = await request
      .post('/users')
      .send({ username: fakeUser.username })

    expect(response.body.message).toBe('Missing information')
    expect(response.status).toBe(400)
  })


  it("should be able to fetch user profile", async () => {
    const createResponse = await request
      .post('/users')
      .send(fakeUser)

    const fetchProfileResponse = await request
      .get('/users/profile')
      .set(authorizationHeader(createResponse.body.accessToken))

    expect(fetchProfileResponse.body.username).toBe(fakeUser.username)
    
  })

  it("should get all users", async () => {
    const createResponse = await request
      .post('/users')
      .send(fakeUser)

    const fetchUsersResponse = await request
      .get('/users')
      .set(authorizationHeader(createResponse.body.accessToken)) 

    expect(Array.isArray(fetchUsersResponse.body)).toBe(true)
  })

  it("should found a specific user", async () => {
    const createResponse = await request
      .post('/users')
      .send(fakeUser)

    const fetchAUserResponse = await request
      .get(`/users/${createResponse.body.user._id}`)
      .set(authorizationHeader(createResponse.body.accessToken))

    expect(createResponse.body.user._id).toBe(fetchAUserResponse.body._id)
  })

  it("should get 'User not found' error", async () => {
    const createResponse = await request
      .post('/users')
      .send(fakeUser)

    const fetchAUserResponse = await request
      .get(`/users/fakeId`)
      .set(authorizationHeader(createResponse.body.accessToken))

    expect(fetchAUserResponse.body.message).toBe('User not found')
    expect(fetchAUserResponse.status).toBe(404)
  })

  it("should check username status", async () => {
    const createResponse = await request
      .post('/users')
      .send(fakeUser)

    const checkUsernameResponse = await request
      .post(`/users/check-username-status`)
      .send(fakeUser)

    const checkUsernameResponse2 = await request
      .post(`/users/check-username-status`)
      .send({ username: 'fakeUser' })

    expect(checkUsernameResponse.body.status).toBe('registered')
    expect(checkUsernameResponse2.body.status).toBe('not registered')
  })
})