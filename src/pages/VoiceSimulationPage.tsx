import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceSimulationPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('Your browser does not support speech recognition. Please try Chrome or Edge.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setFeedback(`Error: ${event.error}`);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setFeedback('Stopped listening');
    } else {
      setTranscript('');
      setFeedback('Listening...');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleNavigateBack = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    }
    navigate('/');
  };

  const processCommand = () => {
    if (!transcript.trim()) return;

    // Simple command processing
    const command = transcript.toLowerCase();
    let response = '';

    if (command.includes('hello') || command.includes('hi')) {
      response = 'Hello! How can I help you today?';
    } else if (command.includes('symptoms') || command.includes('not feeling well')) {
      response = 'I can help with symptom checking. Please describe your symptoms in detail.';
    } else if (command.includes('thank')) {
      response = "You're welcome! Is there anything else I can help with?";
    } else {
      response = "I'm not sure I understand. Can you please rephrase or say 'help' for options?";
    }

    // Speak the response
    const utterance = new SpeechSynthesisUtterance(response);
    window.speechSynthesis.speak(utterance);
    setFeedback(response);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Voice Assistant</h2>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <p className="font-medium">Status: {isListening ? 'Listening...' : 'Ready'}</p>
          <p className="mt-2 text-sm text-gray-700">{feedback}</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h3 className="font-medium mb-2">Transcript:</h3>
          <p className="whitespace-pre-line">{transcript}</p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={toggleListening}
            className={`py-3 px-6 rounded-md text-white font-medium ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>

          <button
            onClick={processCommand}
            disabled={!transcript.trim()}
            className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium disabled:bg-gray-400"
          >
            Process Command
          </button>

          <button
            onClick={handleNavigateBack}
            className="py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}