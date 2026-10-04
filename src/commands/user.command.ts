import { ApiService } from '../services/api.service.js';
import { FsService } from '../services/fs.service.js';

export class UserCommand {
  private api = new ApiService();
  private fs = new FsService();

  async fetchAndSave(userId: string) {
    try {
      const user = await this.api.request(`/users/${userId}`);
      await this.fs.writeJson(`./user-${userId}.json`, user);
      console.log(`Successfully saved user ${userId} to disk.`);
    } catch (error) {
      console.error('Error processing user:', (error as Error).message);
      process.exit(1);
    }
  }
}
