import { eq } from 'drizzle-orm';

import { serverDB } from '@/database/server';

import { NewUser, UserItem, users } from '../schemas/lobechat';
import { SessionModel } from './session';

export class UserModel {
  createUser = async (params: NewUser) => {
    const [user] = await serverDB
      .insert(users)
      .values({ ...params })
      .returning();

    // Create an inbox session for the user
    const model = new SessionModel(user.id);

    await model.createInbox();
  };

  deleteUser = async (id: string) => {
    return serverDB.delete(users).where(eq(users.id, id));
  };

  findById = async (id: string) => {
    return serverDB.query.users.findFirst({ where: eq(users.id, id) });
  };

  async updateUser(id: string, value: Partial<UserItem>) {
    return serverDB
      .update(users)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}
