import { UseCase } from '../types';

export const generateUseCases = async (businessFunction: string, painPoints: string[]): Promise<Partial<UseCase>[]> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${backendUrl}/api/generate-use-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessFunction, painPoints })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = data.useCases || [];

    return parsed.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
      category: businessFunction,
    }));
  } catch (err) {
    console.error('Error calling Backend API:', err);
    // Return mock data for demo safety
    return [
      {
        id: crypto.randomUUID(),
        title: 'Mock AI Assistant (Backend Error)',
        description: 'This is a fallback use case due to API key missing or network failure.',
        llm_generated_reason: 'Fallback generated because Backend is not configured or offline.',
        expected_benefit: 'None',
        risks: 'None',
        prerequisites: 'API Key and Running Backend',
        category: businessFunction
      }
    ];
  }
};
