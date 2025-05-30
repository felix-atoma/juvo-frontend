import type { FC } from 'react';

interface KeypadProps {
  inputValue: string;
  onKeyPress: (value: string) => void;
  disabled?: boolean;
}

const Keypad: FC<KeypadProps> = ({ inputValue, onKeyPress, disabled = false }) => {
  return (
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
          onClick={() => onKeyPress('#')}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={!inputValue || disabled}
        >
          Send
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key.toString())}
            className="p-4 bg-white rounded-md shadow-sm hover:bg-gray-200 text-xl font-mono"
            disabled={disabled}
          >
            {key}
          </button>
        ))}
        <button
          onClick={() => onKeyPress('DEL')}
          className="p-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 text-xl font-mono col-span-3"
          disabled={!inputValue || disabled}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Keypad;