import { AnalysisData } from '../types/Analysis';
import {
  AttachedItem,
  AuthUser,
  ChatUploadResponse,
  ReportListItem,
} from '../types/Api';

const API_BASE_URL = 'https://backend-o2w3.onrender.com';

type AuthResponse = AuthUser & {
  message: string;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
};

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  return parseJson<T>(response);
};

const toUploadPart = (item: AttachedItem) => ({
  uri: item.uri,
  name: item.name || 'upload',
  type:
    item.mimeType ||
    (item.type === 'image' ? 'image/jpeg' : 'text/plain'),
});

export const backendApi = {
  login(email: string, password: string) {
    return requestJson<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup(name: string, email: string, password: string) {
    return requestJson<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async uploadChat(params: {
    items: AttachedItem[];
    category: string;
    myName?: string;
    targetName?: string;
    memberId?: number;
    description?: string;
  }) {
    const formData = new FormData();
    const isBatch = params.items.length > 1;

    params.items.forEach(item => {
      formData.append(isBatch ? 'files' : 'file', toUploadPart(item) as any);
    });

    formData.append('category', params.category);
    if (params.myName?.trim()) {
      formData.append('myName', params.myName.trim());
    }
    if (params.targetName?.trim()) {
      formData.append('targetName', params.targetName.trim());
    }

    if (params.memberId) {
      formData.append('memberId', String(params.memberId));
    }

    if (params.description?.trim()) {
      formData.append('description', params.description.trim());
    }

    return requestJson<ChatUploadResponse>(
      isBatch ? '/api/uploads/chat/batch' : '/api/uploads/chat',
      {
        method: 'POST',
        body: formData,
      },
    );
  },

  getAppResult(reportId: number) {
    return requestJson<AnalysisData>(`/api/reports/${reportId}/app-result`);
  },

  listReports(memberId?: number) {
    const query = memberId ? `?memberId=${memberId}` : '';
    return requestJson<ReportListItem[]>(`/api/reports${query}`);
  },

  listTrash(memberId?: number) {
    const query = memberId ? `?memberId=${memberId}` : '';
    return requestJson<ReportListItem[]>(`/api/reports/trash${query}`);
  },

  moveToTrash(reportId: number) {
    return requestJson<ReportListItem>(`/api/reports/${reportId}/trash`, {
      method: 'PATCH',
    });
  },

  restoreReport(reportId: number) {
    return requestJson<ReportListItem>(`/api/reports/${reportId}/restore`, {
      method: 'PATCH',
    });
  },

  deleteReport(reportId: number) {
    return requestJson<void>(`/api/reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  emptyTrash(memberId?: number) {
    const query = memberId ? `?memberId=${memberId}` : '';
    return requestJson<void>(`/api/reports/trash${query}`, {
      method: 'DELETE',
    });
  },
};
