import ora from 'ora';
import { ApiService } from '../services/api.service.js';
import { FsService } from '../services/fs.service.js';
import { theme, center } from '../theme/theme.js';

export class UserCommand {
  private api = new ApiService();
  private fs = new FsService();

  async fetchAndSave(userId: string): Promise<void> {
    const spinner = ora({
      text: theme.muted(`Fetching user data for #${userId}...`),
      color: 'cyan',
    }).start();

    try {
      const user = await this.api.request(`/users/${userId}`);
      const fileName = `user-${userId}.json`;
      await this.fs.writeJson(`./${fileName}`, user);
      spinner.succeed(theme.text(`Saved user #${userId} to ${theme.accent(fileName)}`));
    } catch (error) {
      spinner.fail(theme.error(`Failed to process user: ${(error as Error).message}`));
      process.exit(1);
    }
  }
}
