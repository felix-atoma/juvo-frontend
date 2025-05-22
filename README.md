# USSD Health Simulation Application

A React-based simulation of a USSD health service that allows users to:
- Navigate through menu options
- Select their preferred language
- Choose health symptoms
- Receive appropriate health advice

## How the USSD Simulation Works

### 1. Dialing Process Flow

1. **Welcome Screen** (*123#)
   - Initial screen with instructions
   - Only accepts `*123#` to proceed
   - Quick dial button available

2. **Language Selection** (*123*X#)
   - Choose from 4 languages:
     - 1. English (*123*1#)
     - 2. Twi (*123*2#)
     - 3. Fante (*123*3#)
     - 4. Dagbani (*123*4#)
   - Sets the language for all subsequent messages

3. **Symptom Selection** (*123*1*X#)
   - List of available symptoms with numbers
   - Each number corresponds to a symptom
   - Example: `*123*1*1#` selects first symptom

4. **Health Feedback**
   - Displays advice in selected language
   - Options to go back or start over

### 2. Input Methods

- **Manual Keypad Entry**:
  - Use the on-screen keypad
  - Press `#` to send/submit your code
  - `*` acts as menu level separator

- **Quick Dial Buttons**:
  - One-tap shortcuts for each step
  - Appears contextually for current menu
  - Shows the exact USSD code it will send

### 3. Special Controls

- **Send Button**:
  - Alternative to pressing `#`
  - Disabled when no input exists
  - Processes current input when clicked

- **Navigation Buttons**:
  - "Back" returns to previous menu
  - "Start Over" resets to welcome screen

### 4. Technical Implementation

```typescript
// Key processing logic
const handleKeyPress = (value: string) => {
  if (value === '#') {
    processUssdCode(inputValue + '#');
  } else {
    setInputValue(prev => prev + value);
  }
};

// Code structure example
*123#     // Main menu
*123*1#   // English language
*123*1*2# // Selects second symptom