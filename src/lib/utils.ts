import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely attempts to copy text to the clipboard.
 * @param text The text to copy.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export async function safeCopy(text: string): Promise<boolean> {
  // Check for secure context and navigator.clipboard
  if (!navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }

  // Modern clipboard API
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Async clipboard copy failed:', err);
    return false;
  }
}
