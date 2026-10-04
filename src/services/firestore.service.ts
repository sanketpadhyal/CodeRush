import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  path.resolve(process.cwd(), './firebase/service-account.json'),
  path.resolve(process.cwd(), '../CodeRush-Backend/firebase/service-account.json'),
  path.resolve(__dirname, '../../firebase/service-account.json'),
  path.resolve(__dirname, '../../../CodeRush-Backend/firebase/service-account.json'),
];

let serviceAccountData: any = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    try {
      serviceAccountData = JSON.parse(fs.readFileSync(p, 'utf8'));
      break;
    } catch (_) {}
  }
}

let app: App | null = null;
if (serviceAccountData && !getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccountData),
    projectId: serviceAccountData.project_id,
  });
} else if (getApps().length) {
  app = getApps()[0];
}

const CHARACTERS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const generateCode = (length: number = 6): string => {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARACTERS[bytes[i] % CHARACTERS.length];
  }
  return result;
};

const detectLang = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescriptreact',
    js: 'javascript',
    jsx: 'javascriptreact',
    py: 'python',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    go: 'go',
    rs: 'rust',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    sh: 'shell',
    sql: 'sql',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
  };
  return ext && map[ext] ? map[ext] : 'plaintext';
};

export class FirestoreService {
  private getDb(): Firestore {
    if (!app && getApps().length === 0) {
      throw new Error('Firestore credentials not initialized');
    }
    return getFirestore(app || getApps()[0]);
  }

  async generate(data: { fileName: string; code: string; author?: string; language?: string }) {
    const db = this.getDb();
    const collection = db.collection('snippets');

    let shareCode = generateCode(6);
    let attempts = 0;

    while (attempts < 5) {
      const existing = await collection.where('shareCode', '==', shareCode).limit(1).get();
      if (existing.empty) {
        break;
      }
      shareCode = generateCode(6);
      attempts++;
    }

    const now = new Date().toISOString();
    const language = data.language || detectLang(data.fileName);

    const docRef = collection.doc();
    const docData = {
      id: docRef.id,
      shareCode,
      fileName: data.fileName,
      code: data.code,
      language,
      author: data.author || 'Anonymous',
      createdAt: now,
      updatedAt: now,
      views: 0,
    };

    await docRef.set(docData);
    return docData;
  }

  async pull(shareCode: string) {
    const db = this.getDb();
    const collection = db.collection('snippets');
    const snapshot = await collection.where('shareCode', '==', shareCode.toUpperCase()).limit(1).get();

    if (snapshot.empty) {
      throw new Error(`Code snippet with share code '${shareCode}' not found`);
    }

    const doc = snapshot.docs[0];
    await doc.ref.update({
      views: FieldValue.increment(1),
    });

    const docData = doc.data();
    return {
      ...docData,
      views: (docData.views || 0) + 1,
    } as any;
  }
}
