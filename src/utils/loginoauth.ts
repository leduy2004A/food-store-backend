import { AnyRecord } from 'dns'
import { Response } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { sha256 } from '~/constants/hashPassword.constants'
import { token } from '~/schema/token.schema'
import users from '~/schema/users.schema'
import dbs from '~/services/database.service'
import userservice from '~/services/users.service'
import { sendEmail } from './email'
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user: any, done) {
  done(null, user)
})
passport.use(
  new GoogleStrategy(
    {
      clientID: '662813587202-8ffsmrcliu6rg4kmpkh61df4qcmmkktj.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/api/vers1/oauth/google',
      passReqToCallback: true
    },
    async function (req: any, accessToken: any, refreshToken: any, profile: any, done: any) {
      const result = await dbs.Users.findOne({ email: profile.email })
      if (!result) {
        const data = {
          email: profile.email,
          password: sha256(profile.email),
          name: profile.displayName
        }
        const resultInsert = await dbs.Users.insertOne(new users(data))
        const { access_token, refresh_token } = await userservice.signRefreshAndAccessToken(
          resultInsert.insertedId.toString()
        )
        await dbs.Token.insertOne(new token({ user_id: resultInsert.insertedId, token: refresh_token }))
        await sendEmail({ to: profile.email, subject: 'Welcome to our app' })
        const tokenApp = {
          access_token,
          refresh_token
        }
        return done(null, tokenApp)
      } else {
        const { access_token, refresh_token } = await userservice.signRefreshAndAccessToken(result._id.toString())
        await dbs.Token.insertOne(new token({ user_id: result._id, token: refresh_token }))
        const tokenApp = {
          access_token,
          refresh_token
        }
        return done(null, tokenApp)
      }
    }
  )
)
