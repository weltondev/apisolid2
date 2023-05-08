import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '@/services/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodyRegisterSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = bodyRegisterSchema.parse(request.body)

  try {
    const prismaUserRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUserRepository)

    registerService.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    console.log(error)

    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  reply.status(201).send()
}
