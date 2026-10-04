import { FirestoreService } from './firestore.service.js';

export interface CodeSnippetResponse {
  id: string;
  shareCode: string;
  fileName: string;
  code: string;
  language: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export class ApiService {
  private readonly baseUrl = process.env.CODERUSH_API_URL || 'https://backend.coderush.tech';
  private readonly firestore = new FirestoreService();

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data.data !== undefined ? data.data : data;
  }

  async generate(payload: { fileName: string; code: string; author?: string; language?: string }): Promise<CodeSnippetResponse> {
    try {
      return await this.request<CodeSnippetResponse>('/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (_) {
      return await this.firestore.generate(payload);
    }
  }

  async modify(payload: { shareCode: string; code: string; fileName?: string; author?: string }): Promise<CodeSnippetResponse> {
    try {
      return await this.request<CodeSnippetResponse>('/modify', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch (_) {
      return await this.firestore.generate({
        fileName: payload.fileName || 'snippet.txt',
        code: payload.code,
        author: payload.author,
      });
    }
  }

  async pull(shareCode: string): Promise<CodeSnippetResponse> {
    try {
      return await this.request<CodeSnippetResponse>(`/pull/${encodeURIComponent(shareCode)}`, {
        method: 'GET',
      });
    } catch (_) {
      return await this.firestore.pull(shareCode);
    }
  }
}
