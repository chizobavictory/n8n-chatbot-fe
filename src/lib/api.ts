export interface ChatResponse {
  messages: string[];
}

const FIXED_SESSION_ID = 'single-user';
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '';

export const generateSessionId = (): string => {
  const storedSessionId = localStorage.getItem('n8n-chat-session-id');
  if (storedSessionId !== FIXED_SESSION_ID) {
    localStorage.setItem('n8n-chat-session-id', FIXED_SESSION_ID);
  }
  return FIXED_SESSION_ID;
};

const readFileAsDataUrl = (file: Blob | File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
        return;
      }
      reject(new Error('Unexpected file reader result'));
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export const sendMessage = async (message: string, file: Blob | File | null, fileType: 'image' | 'audio' | null): Promise<void> => {
  const sessionId = generateSessionId();
  const formData = new FormData();

  formData.append('sessionId', sessionId);
  if (message) formData.append('text', message);

  if (file && fileType) {
    formData.append('file', file, fileType === 'audio' ? 'recording.webm' : 'image.png');
    formData.append('fileType', fileType);
    if (fileType === 'image') {
      try {
        const imageDataUrl = await readFileAsDataUrl(file);
        formData.append('imageDataUrl', imageDataUrl);
      } catch (error) {
        console.error('Failed to read image file', error);
      }
    }
  }

  // Fire and forget (Async)
  await fetch(`${API_BASE_URL}/webhook/chat`, {
    method: 'POST',
    body: formData,
  });
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const getHistory = async (): Promise<ChatMessage[]> => {
  const sessionId = generateSessionId();
  try {
    const response = await fetch(`${API_BASE_URL}/webhook/history?sessionId=${sessionId}&t=${Date.now()}`);
    const data = await response.json();

    // Handle n8n's "no items" response
    if (data?.message === 'No item to return was found' || data?.code === 0) {
      return [];
    }

    // data should be array of DB rows OR { data: [...] } depending on n8n output
    return Array.isArray(data) ? data : data.data || [];
  } catch (e) {
    console.error('Polling error', e);
    return [];
  }
};
