import { authorizationHeader, fakeUser } from "../tests/config"
import { request } from "../tests/setup"

describe("image routes", () => {
  
  it("should get a array of icons", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const clientIconsResponse = await request
      .get('/images/client-icons/')
      .set(authorizationHeader(createUserResponse.body.accessToken))

      expect(Array.isArray(clientIconsResponse.body.urls)).toBe(true)

  })
})