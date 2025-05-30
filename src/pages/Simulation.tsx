import { useState, useEffect } from 'react';
import axios from 'axios';

type SymptomKey = 'headache' | 'swollen_feet' | 'nosebleed' | 'eye_pain' | 'stomach_pain';
type LanguageKey = 'en' | 'twi' | 'fante' | 'ewe' | 'dagbani';

interface LanguageOption {
  code: LanguageKey;
  name: string;
}

interface SymptomOption {
  id: number;
  key: SymptomKey;
  name: string;
}

export default function SimulationPage() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'language' | 'symptom' | 'feedback'>('welcome');
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('en');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomKey | null>(null);
  const [lastValidCode, setLastValidCode] = useState('');
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomOption[]>([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fallback data in case API fails
  const fallbackLanguages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'twi', name: 'Twi' },
    { code: 'fante', name: 'Fante' },
    { code: 'ewe', name: 'Ewe' },
    { code: 'dagbani', name: 'Dagbani' }
  ];

  const fallbackSymptoms: SymptomOption[] = [
    { id: 1, key: 'headache', name: 'Headache' },
    { id: 2, key: 'swollen_feet', name: 'Swollen Feet' },
    { id: 3, key: 'nosebleed', name: 'Nosebleed' },
    { id: 4, key: 'eye_pain', name: 'Eye Pain' },
    { id: 5, key: 'stomach_pain', name: 'Stomach Pain' }
  ];

  // Fetch languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/languages`);
        
        // Validate response is an array
        const data = Array.isArray(response.data) ? response.data : fallbackLanguages;
        setLanguages(data);
      } catch (err) {
        setError('Failed to load languages. Using default options.');
        setLanguages(fallbackLanguages);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [API_BASE_URL]);

  // Fetch symptoms when language changes
  useEffect(() => {
    if (currentStep === 'symptom') {
      const fetchSymptoms = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/symptoms?lang=${selectedLanguage}`);
          
          // Validate response is an array
          const data = Array.isArray(response.data) ? response.data : fallbackSymptoms;
          setSymptoms(data);
        } catch (err) {
          setError('Failed to load symptoms. Using default options.');
          setSymptoms(fallbackSymptoms);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSymptoms();
    }
  }, [selectedLanguage, currentStep, API_BASE_URL]);

  const handleKeyPress = async (value: string) => {
    if (value === '#') {
      await processUssdCode(inputValue + '#');
    } else if (value === 'DEL') {
      setInputValue(prev => prev.slice(0, -1));
    } else {
      setInputValue(prev => prev + value);
    }
  };

  const processUssdCode = async (code: string) => {
    const cleanCode = code.replace(/#$/, '');
    const parts = cleanCode.split('*').filter(part => part !== '');
    setLastValidCode(code);
    setError('');

    // Reset to welcome if empty code is sent
    if (code === '#') {
      setCurrentStep('welcome');
      setInputValue('');
      return;
    }

    try {
      // Welcome screen - dial *123#
      if (parts.length === 1 && parts[0] === '123') {
        setCurrentStep('language');
      }
      // Language selection - *123*1#
      else if (parts.length === 2 && parts[0] === '123') {
        const langIndex = parseInt(parts[1]) - 1;
        if (langIndex >= 0 && langIndex < languages.length) {
          const selected = languages[langIndex];
          setSelectedLanguage(selected.code);
          setCurrentStep('symptom');
        } else {
          setError('Invalid language selection');
        }
      }
      // Symptom selection - *123*1*1#
      else if (parts.length === 3 && parts[0] === '123') {
        const symptomIndex = parseInt(parts[2]) - 1;
        if (symptomIndex >= 0 && symptomIndex < symptoms.length) {
          const selected = symptoms[symptomIndex];
          setSelectedSymptom(selected.key);
          
          // Fetch feedback from backend
          setLoading(true);
          const response = await axios.get(
            `${API_BASE_URL}/api/feedback?symptom=${selected.key}&lang=${selectedLanguage}`
          );
          setFeedback(response.data?.feedback || 'No advice available for this symptom');
          setCurrentStep('feedback');
        } else {
          setError('Invalid symptom selection');
        }
      } else {
        setError('Invalid USSD code format');
      }
    } catch (err) {
      setError('Failed to process your request');
      console.error(err);
    } finally {
      setLoading(false);
      setInputValue('');
    }
  };

  const handleManualStepChange = (step: typeof currentStep) => {
    setCurrentStep(step);
    setInputValue('');
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
            Loading...
          </div>
        )}

        {/* Display last successfully processed code */}
        {lastValidCode && (
          <div className="mb-2 text-sm text-gray-500">
            Last dialed: <span className="font-mono">{lastValidCode}</span>
          </div>
        )}

        {currentStep === 'welcome' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Welcome to JUVO Health</h2>
            <p className="mb-6">Dial *123# to begin</p>
            <button
              onClick={() => handleKeyPress('*123#')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
              disabled={loading}
            >
              Quick Dial: *123#
            </button>
          </div>
        )}

        {currentStep === 'language' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Language:</h3>
            {languages.length > 0 ? (
              <>
                <div className="space-y-2 mb-6">
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        handleManualStepChange('symptom');
                      }}
                      className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
                      disabled={loading}
                    >
                      {index + 1}. {lang.name}
                    </button>
                  ))}
                </div>
                
                <h4 className="text-md font-medium mb-2">Quick Dial Options:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((_, index) => (
                    <button
                      key={`lang-${index}`}
                      onClick={() => handleKeyPress(`*123*${index + 1}#`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                      disabled={loading}
                    >
                      *123*{index + 1}#
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                {loading ? 'Loading languages...' : 'No languages available'}
              </p>
            )}
          </div>
        )}

        {currentStep === 'symptom' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Symptom:</h3>
            {symptoms.length > 0 ? (
              <>
                <div className="space-y-2 mb-6">
                  {symptoms.map((symptom, index) => (
                    <button
                      key={symptom.key}
                      onClick={async () => {
                        setSelectedSymptom(symptom.key);
                        try {
                          setLoading(true);
                          const response = await axios.get(
                            `${API_BASE_URL}/api/feedback?symptom=${symptom.key}&lang=${selectedLanguage}`
                          );
                          setFeedback(response.data?.feedback || 'No advice available for this symptom');
                          setCurrentStep('feedback');
                        } catch (err) {
                          setError('Failed to get feedback');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
                      disabled={loading}
                    >
                      {index + 1}. {symptom.name}
                    </button>
                  ))}
                </div>
                
                <h4 className="text-md font-medium mb-2">Quick Dial Options:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map((_, index) => (
                    <button
                      key={`symptom-${index}`}
                      onClick={() => handleKeyPress(`*123*1*${index + 1}#`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                      disabled={loading}
                    >
                      *123*1*{index + 1}#
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                {loading ? 'Loading symptoms...' : 'No symptoms available'}
              </p>
            )}
          </div>
        )}

        {currentStep === 'feedback' && selectedSymptom && (
          <div>
            <h3 className="text-lg font-medium mb-4">Health Advice:</h3>
            <div className="p-4 bg-blue-50 rounded-md mb-6">
              <p className="whitespace-pre-line">
                {feedback || 'No feedback available for this symptom'}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleManualStepChange('symptom')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={() => handleManualStepChange('welcome')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 border-t">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={inputValue}
            readOnly
            className="flex-1 p-2 border rounded text-center text-xl font-mono"
            placeholder="Dial *123#"
          />
          <button
            onClick={() => inputValue && handleKeyPress('#')}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={!inputValue || loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key.toString())}
              className="p-4 bg-white rounded-md shadow-sm hover:bg-gray-200 text-xl font-mono"
              disabled={loading}
            >
              {key}
            </button>
          ))}
          {/* Delete button */}
          <button
            onClick={() => handleKeyPress('DEL')}
            className="p-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 text-xl font-mono col-span-3"
            disabled={!inputValue || loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}