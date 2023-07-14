import { randomUUID } from 'crypto'
import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const { name, email, password_hash, checkIns } = data

    const user = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      checkIns,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) return null

    return user
  }
}
