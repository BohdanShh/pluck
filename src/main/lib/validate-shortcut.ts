const FUNCTION_KEY = /^F([1-9]|1\d|2[0-4])$/;
const REQUIRED_MODIFIERS = ['Control', 'Alt', 'Command'];

export function validateShortcut(accelerator: string) {
  const parts = accelerator.split('+');

  if (FUNCTION_KEY.test(parts.at(-1) ?? '')) return null;
  if (!REQUIRED_MODIFIERS.some(modifier => parts.includes(modifier))) {
    return 'Use ⌘, ⌃ or ⌥ in the shortcut';
  }

  return null;
}
