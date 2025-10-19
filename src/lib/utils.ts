import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely attempts to copy text to the clipboard, with fallbacks.
 * @param text The text to copy.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export async function safeCopy(text: string): Promise<boolean> {
  try {
    // Modern, secure API
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    // The modern API failed, fall through to the legacy method.
  }

  // Fallback for older browsers or insecure contexts (non-HTTPS)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px'; // Move it off-screen
    document.body.appendChild(textArea);
    
    const selection = document.getSelection();
    const selectedRange = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0) 
      : null;
      
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Restore the original selection if it existed
    if (selectedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }
    return true;
  } catch (err) {
    console.error('Fallback copy method failed:', err);
    return false;
  }
}