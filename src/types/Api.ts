export type AttachedItem = {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'file';
  mimeType?: string | null;
};

export type AuthUser = {
  memberId: number;
  email: string;
  name: string;
  token?: string;
};

export type ChatUploadResponse = {
  reportId: number;
  status: string;
  analysisMode: 'STRUCTURED' | 'FLEXIBLE';
  message: string;
  warning?: string | null;
};

export type ReportListItem = {
  reportId: number;
  memberId?: number | null;
  title: string;
  category: string;
  sourceType: string;
  messageCount: number;
  uploadedFileCount: number;
  status: string;
  analysisMode: 'STRUCTURED' | 'FLEXIBLE';
  resultScore: number;
  description?: string | null;
  trashed: boolean;
  createdAt: string;
  trashedAt?: string | null;
};
