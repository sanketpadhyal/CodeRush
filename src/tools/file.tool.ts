import fs from 'fs';
import path from 'path';
import os from 'os';

export interface FileData {
  filePath: string;
  fileName: string;
  content: string;
  size: number;
  extension: string;
}

export class FileTool {
  static resolvePath(inputPath: string): string {
    const trimmed = inputPath.trim();
    if (trimmed.startsWith('~')) {
      return path.join(os.homedir(), trimmed.slice(1));
    }
    return path.resolve(process.cwd(), trimmed);
  }

  static fileExists(inputPath: string): boolean {
    const resolved = this.resolvePath(inputPath);
    return fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  }

  static readFile(inputPath: string): FileData {
    const resolved = this.resolvePath(inputPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`File not found at: ${resolved}`);
    }

    const stat = fs.statSync(resolved);
    if (!stat.isFile()) {
      throw new Error(`Path is not a regular file: ${resolved}`);
    }

    const content = fs.readFileSync(resolved, 'utf8');
    const fileName = path.basename(resolved);
    const extension = path.extname(resolved).slice(1);

    return {
      filePath: resolved,
      fileName,
      content,
      size: stat.size,
      extension,
    };
  }

  static writeFile(inputPath: string, content: string): string {
    const resolved = this.resolvePath(inputPath);
    const dir = path.dirname(resolved);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(resolved, content, 'utf8');
    return resolved;
  }

  static renameFile(currentPath: string, newName: string): string {
    const resolved = this.resolvePath(currentPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Cannot rename non-existent file: ${resolved}`);
    }

    const dir = path.dirname(resolved);
    const targetPath = path.isAbsolute(newName) ? newName : path.join(dir, newName);

    fs.renameSync(resolved, targetPath);
    return targetPath;
  }
}
