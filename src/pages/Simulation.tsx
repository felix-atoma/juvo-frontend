import { useState } from 'react';
import { symptomFeedback } from '../data/symptomFeedback';

type SymptomKey = keyof typeof symptomFeedback;
type LanguageKey = keyof (typeof symptomFeedback)[SymptomKey];

export default function SimulationPage() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'language' | 'symptom' | 'feedback'>('welcome');
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('en');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomKey | null>(null);
  const [lastValidCode, setLastValidCode] = useState('');

  const handleKeyPress = (value: string) => {
    if (value === '#') {
      processUssdCode(inputValue + '#');
    } else {
      setInputValue(prev => prev + value);
    }
  };

  const processUssdCode = (code: string) => {
    const cleanCode = code.replace(/#$/, '');
    const parts = cleanCode.split('*').filter(part => part !== '');
    setLastValidCode(code);

    // Reset to welcome if empty code is sent
    if (code === '#') {
      setCurrentStep('welcome');
      setInputValue('');
      return;
    }

    // Welcome screen - dial *123#
    if (parts.length === 1 && parts[0] === '123') {
      setCurrentStep('language');
    }
    // Language selection - *123*1#
    else if (parts.length === 2 && parts[0] === '123') {
      const langIndex = parseInt(parts[1]) - 1;
      const languages: LanguageKey[] = ['en', 'twi', 'fante', 'dagbani'];
      if (!isNaN(langIndex) && langIndex >= 0 && langIndex < languages.length) {
        setSelectedLanguage(languages[langIndex]);
        setCurrentStep('symptom');
      }
    }
    // Symptom selection - *123*1*1#
    else if (parts.length === 3 && parts[0] === '123') {
      const symptomKeys = Object.keys(symptomFeedback) as SymptomKey[];
      const symptomIndex = parseInt(parts[2]) - 1;
      if (!isNaN(symptomIndex) && symptomIndex >= 0 && symptomIndex < symptomKeys.length) {
        setSelectedSymptom(symptomKeys[symptomIndex]);
        setCurrentStep('feedback');
      }
    }

    setInputValue('');
  };

  const handleManualStepChange = (step: typeof currentStep) => {
    setCurrentStep(step);
    setInputValue('');
  };

  const symptomKeys = Object.keys(symptomFeedback) as SymptomKey[];

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
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
            >
              Quick Dial: *123#
            </button>
          </div>
        )}

        {currentStep === 'language' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Language:</h3>
            <div className="space-y-2 mb-6">
              {['English', 'Twi', 'Fante', 'Dagbani'].map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(['en', 'twi', 'fante', 'dagbani'][index] as LanguageKey);
                    handleManualStepChange('symptom');
                  }}
                  className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {index + 1}. {lang}
                </button>
              ))}
            </div>
            
            <h4 className="text-md font-medium mb-2">Quick Dial Options:</h4>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={`lang-${num}`}
                  onClick={() => handleKeyPress(`*123*${num}#`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  *123*{num}#
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'symptom' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Symptom:</h3>
            <div className="space-y-2 mb-6">
              {symptomKeys.map((symptom, index) => (
                <button
                  key={symptom}
                  onClick={() => {
                    setSelectedSymptom(symptom);
                    handleManualStepChange('feedback');
                  }}
                  className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {index + 1}. {symptom}
                </button>
              ))}
            </div>
            
            <h4 className="text-md font-medium mb-2">Quick Dial Options:</h4>
            <div className="grid grid-cols-2 gap-2">
              {symptomKeys.map((symptom, index) => (
                <button
                  key={`symptom-${index}`}
                  onClick={() => handleKeyPress(`*123*1*${index + 1}#`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  *123*1*{index + 1}#
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'feedback' && selectedSymptom && (
          <div>
            <h3 className="text-lg font-medium mb-4">Health Advice:</h3>
            <div className="p-4 bg-blue-50 rounded-md mb-6">
              <p className="whitespace-pre-line">
                {symptomFeedback[selectedSymptom][selectedLanguage]}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleManualStepChange('symptom')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Back
              </button>
              <button
                onClick={() => handleManualStepChange('welcome')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
            disabled={!inputValue}
          >
            Send
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key.toString())}
              className="p-4 bg-white rounded-md shadow-sm hover:bg-gray-200 text-xl font-mono"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}