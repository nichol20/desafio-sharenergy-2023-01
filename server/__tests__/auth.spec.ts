import { authorizationHeader, fakeUser } from "../tests/config"
import { agent, request } from "../tests/setup"

describe("auth routes", () => {

  it("should be blocked for not having a token", async () => {
    const clientIconsResponse = await request
      .get('/images/client-icons/')

    expect(clientIconsResponse.status).toBe(401)
  })

  it("should be blocked for not having a invalid token", async () => {
    const clientIconsResponse = await request
      .get('/images/client-icons/')
      .set(authorizationHeader('fakeToken'))

    expect(clientIconsResponse.status).toBe(403)
  })

  it("should get refresh and accesss token from login route", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const loginResponse = await request
      .post('/login')
      .send(fakeUser)

    const cookies = loginResponse.get('Set-Cookie')
    const jwtCookie = cookies.filter(cookie => cookie.includes('jwt'))[0]

    // refresh token
    expect(!!jwtCookie).toBe(true)
    expect(loginResponse.body).toHaveProperty('accessToken')
  })

  it("should get a new access token", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const cookies = createUserResponse.get('Set-Cookie');

    const refreshResponse = await request
      .get('/refresh-token')
      .set('Cookie', cookies)

      expect(refreshResponse.body).toHaveProperty('accessToken')
  })

  it("should get a new refresh token with a duration of 30 days", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const rememberResponse = await request
      .get('/remember')
      .set(authorizationHeader(createUserResponse.body.accessToken))

    const cookies = rememberResponse.get('Set-Cookie')
    const jwtCookie = cookies.filter(cookie => cookie.includes('jwt'))[0]
    const maxAge = jwtCookie.split(';').filter(p => p.includes('Max-Age'))[0]
    const thirty = 30 * 24 * 60 * 60 // 30d in seconds

    expect(maxAge).toEqual(` Max-Age=${thirty}`)
  })

  it("should clear cookie on logout", async () => {
    const createUserResponse = await request
      .post('/users')
      .send(fakeUser)

    const cookies = createUserResponse.get('Set-Cookie')

    const logoutResponse = await request
      .get('/logout')
      .set('Cookie', cookies)

    const cookiesFromLogout = logoutResponse.get('Set-Cookie')
    const jwtCookieValue = cookiesFromLogout.filter(cookie => cookie.includes('jwt'))[0].split(';')[0].split('=')[1]

    expect(jwtCookieValue.length).toBe(0)
  })
})