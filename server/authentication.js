import jwt from 'jsonwebtoken'
import debug from 'debug'
import dotenv from 'dotenv'

import { ROLES } from './config'

dotenv.config()

const log = debug('server:authentication')

export function createToken({ id, role } = {}) {
  // eslint-disable-next-line no-undef
  log(`create token with user id ${id}`)
  return id && role && jwt.sign({ userId: id, role }, process.env.JWT_SECRET)
}

export function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export function isLoggedIn({ role }) {
  return !!Object.values(ROLES).find(existingRole => existingRole === role)
}

export function canPublish({ role }) {
  return role === ROLES.publisher || role === ROLES.admin
}
