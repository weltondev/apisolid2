// import { prisma } from '@/libs/prisma'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface registerServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: registerServiceRequest) {
    const password_hash = await hash(password, 6)

    const findByEmail = await this.usersRepository.findByEmail(email)

    if (findByEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
