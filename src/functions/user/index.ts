import { db } from "../../config/database";
import { users } from "../../core/models";

export async function createUser(phoneNumber: string) {
  const newUser = await db.insert(users).values({ phoneNumber }).returning();
  return newUser[0];
}
export async function findUserByPhoneNumber(phoneNumber: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.phoneNumber, phoneNumber),
  });
  return user;
}
