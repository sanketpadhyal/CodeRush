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
  private readonly baseUrl = process.env.CODERUSH_API_URL || 'http://localhost:5001';

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data.data !== undefined ? data.data : data;
  }

  async generate(payload: { fileName: string; code: string; author?: string; language?: string }): Promise<CodeSnippetResponse> {
    return this.request<CodeSnippetResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async modify(payload: { shareCode: string; code: string; fileName?: string; author?: string }): Promise<CodeSnippetResponse> {
    return this.request<CodeSnippetResponse>('/modify', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async pull(shareCode: string): Promise<CodeSnippetResponse> {
    return this.request<CodeSnippetResponse>(`/pull/${encodeURIComponent(shareCode)}`, {
      method: 'GET',
    });
  }
}
