const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const app = require('../src/app')

const userOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'mike1234',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'peki',
            email: 'peki@example.com',
            password: 'peki123'
        }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: user.name,
            email: user.email,
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('peki123')
})

test('Should login', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    console.log(response.body.user, 'response usewer')
    const user = await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login')
        .send({
            email: 'pera@peric.com',
            password: 'userOne'
        }).expect(400)
})

test('Should fetch user profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user', async () => {
    const result = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar img', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mika Antic'
        })
        .expect(200)
    const user = await User.findById(userOneID)
    expect(user.name).toBe('Mika Antic')
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Serbia'
        })
        .expect(400)
})