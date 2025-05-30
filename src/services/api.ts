import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://juvo-backend.onrender.com',
  timeout: 10000,
});

export interface Language {
  code: string;
  name: string;
}

export interface Symptom {
  id: string;
  name: string;
}

export interface HealthAdvice {
  symptom: string;
  advice: string;
}

export const HealthService = {
  async getLanguages(): Promise<Language[]> {
    try {
      const response = await api.get('/api/languages');
      return Array.isArray(response.data) 
        ? response.data.map((lang: any) => ({
            code: lang.code || '',
            name: lang.name || ''
          }))
        : [];
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  },

  async getSymptoms(): Promise<Symptom[]> {
    try {
      const response = await api.get('/api/symptoms');
      return Array.isArray(response.data)
        ? response.data.map((sym: any) => ({
            id: sym.id || '',
            name: sym.name || ''
          }))
        : [];
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [];
    }
  },

  async getAdvice(symptomId: string, languageCode: string): Promise<HealthAdvice> {
    try {
      const response = await api.get(`/api/advice?symptom=${symptomId}&lang=${languageCode}`);
      return {
        symptom: response.data.symptom || '',
        advice: response.data.advice || 'No advice available for this symptom.'
      };
    } catch (error) {
      console.error('Error fetching advice:', error);
      return {
        symptom: symptomId,
        advice: 'Failed to load health advice. Please try again later.'
      };
    }
  }
};