import { promises as fs } from 'fs';
import path from 'path';

export class FsService {
  async writeJson(filePath: string, data: any): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), filePath);
    await fs.writeFile(absolutePath, JSON.stringify(data, null, 2));
  }

  async readJson<T>(filePath: string): Promise<T> {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(content);
  }
}
