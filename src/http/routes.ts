import { FastifyInstance } from 'fastify'
import { register } from './contollers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
