import { type User, type InsertUser, type UpdateUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: UpdateUser): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password ?? null,
      name: insertUser.name,
      birthDate: insertUser.birthDate ?? null,
      birthTime: insertUser.birthTime ?? null,
      birthPlace: insertUser.birthPlace ?? null,
      birthLatitude: insertUser.birthLatitude ?? null,
      birthLongitude: insertUser.birthLongitude ?? null,
      isSubscribed: insertUser.isSubscribed ?? false,
      trialEndsAt: insertUser.trialEndsAt ?? null,
      questionsAsked: insertUser.questionsAsked ?? 0,
      dailyStreak: insertUser.dailyStreak ?? 0,
      lastActiveAt: insertUser.lastActiveAt ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

export const storage = new MemStorage();
