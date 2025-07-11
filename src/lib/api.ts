const API_BASE_URL = 'https://popcorn.touchpay.one/';

export interface ApiItem {
  _id: string;
  api_title: string;
}

export interface Subtitle {
  subtitle: string;
  apis: ApiItem[];
}

export interface SidebarItem {
  title: string;
  subtitles: Subtitle[];
}

export interface ApiDoc {
  _id: string;
  title: string;
  subtitle: string;
  api_title: string;
  method: string;
  endpoint: string;
  endpoint_description: string;
  description: string;
  request_body: any;
  response_body: any;
  path_parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  accessToken: string;
  accessRole: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function fetchSidebarData(): Promise<SidebarItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/docs/sidebar`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function fetchApiDoc(id: string): Promise<ApiDoc | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/docs/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API doc:', error);
    return null;
  }
}

export async function searchApiDocs(query: string): Promise<ApiDoc[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/docs?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching API docs:', error);
    return [];
  }
}

export async function createApiDoc(apiData: Omit<ApiDoc, '_id' | 'createdAt' | 'updatedAt' | '__v'>): Promise<ApiDoc | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating API doc:', error);
    return null;
  }
} 