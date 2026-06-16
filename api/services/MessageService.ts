import { db } from '../db';
import type { Message } from '../../shared/types';

export class MessageService {
  static getMessages(limit?: number, offset?: number): { data: Message[]; total: number } {
    let messages = [...db.messages.getAll()];
    const total = messages.length;

    if (offset !== undefined) {
      messages = messages.slice(offset);
    }
    if (limit !== undefined) {
      messages = messages.slice(0, limit);
    }

    return { data: messages, total };
  }

  static getMessageById(id: number): Message | undefined {
    return db.messages.getById(id);
  }

  static createMessage(author: string, content: string, email?: string): Message {
    return db.messages.create({ author, content, email });
  }

  static updateMessage(id: number, updates: Partial<Omit<Message, 'id' | 'createdAt'>>): Message | undefined {
    return db.messages.update(id, updates);
  }

  static deleteMessage(id: number): boolean {
    return db.messages.delete(id);
  }
}
