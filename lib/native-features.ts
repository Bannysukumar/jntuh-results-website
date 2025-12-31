import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Check if the app is running on a native platform
 */
export const isNative = () => Capacitor.isNativePlatform();

/**
 * Get the API base URL - use external URLs for native apps
 * This ensures the standalone app works without needing local API routes
 */
export const getApiBaseUrl = () => {
  if (isNative()) {
    // Use external API endpoints for native apps
    return 'https://jntuhresults.up.railway.app';
  }
  // Use relative paths for web (works with Next.js API routes)
  return '';
};

/**
 * Get full API URL for a given endpoint
 */
export const getApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const baseUrl = getApiBaseUrl();
  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  }
  
  return url;
};

/**
 * Share content using native share dialog
 */
export const shareContent = async (options: {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}) => {
  if (isNative()) {
    try {
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Share',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback for web
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Copy to clipboard as fallback
      const textToCopy = `${options.title}\n${options.text}${options.url ? `\n${options.url}` : ''}`;
      await navigator.clipboard.writeText(textToCopy);
      alert('Content copied to clipboard!');
    }
  }
};

/**
 * Save file to device storage (native only)
 */
export const saveFile = async (filename: string, data: string, encoding: 'utf8' | 'base64' = 'utf8') => {
  if (!isNative()) {
    // Web fallback: download file
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  try {
    const fileData = encoding === 'base64' ? data : data;
    await Filesystem.writeFile({
      path: filename,
      data: fileData,
      directory: Directory.Documents,
      encoding: encoding === 'base64' ? Encoding.UTF8 : Encoding.UTF8,
    });
    return { success: true, path: filename };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

/**
 * Read file from device storage (native only)
 */
export const readFile = async (filename: string) => {
  if (!isNative()) {
    throw new Error('File reading is only available on native platforms');
  }

  try {
    const result = await Filesystem.readFile({
      path: filename,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    return result.data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

/**
 * Check if file exists (native only)
 */
export const fileExists = async (filename: string) => {
  if (!isNative()) {
    return false;
  }

  try {
    await Filesystem.stat({
      path: filename,
      directory: Directory.Documents,
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get app info
 */
export const getAppInfo = async () => {
  if (isNative()) {
    return await App.getInfo();
  }
  return null;
};

/**
 * Haptic feedback
 */
export const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (isNative()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Error with haptics:', error);
    }
  }
};

/**
 * Share result as text
 */
export const shareResult = async (hallTicket: string, resultData: any) => {
  const resultText = `JNTUH Result for Hall Ticket: ${hallTicket}\n\n` +
    `CGPA: ${resultData.cgpa || 'N/A'}\n` +
    `Total Credits: ${resultData.totalCredits || 'N/A'}\n` +
    `Backlogs: ${resultData.backlogs || 0}\n\n` +
    `View full result at: https://manajntuhresults.vercel.app`;

  await shareContent({
    title: 'JNTUH Result',
    text: resultText,
    dialogTitle: 'Share Result',
  });
};

/**
 * Save result as PDF locally (native)
 */
export const saveResultPDF = async (filename: string, pdfData: string) => {
  if (isNative()) {
    await saveFile(filename, pdfData, 'base64');
    await hapticFeedback(ImpactStyle.Light);
    return { success: true, message: 'Result saved to device' };
  } else {
    // Web fallback
    await saveFile(filename, pdfData);
    return { success: true, message: 'Result downloaded' };
  }
};

/**
 * Save result data to local storage (native filesystem)
 */
export const saveResultToLocal = async (hallTicket: string, resultData: any) => {
  if (!isNative()) {
    // Web fallback: use localStorage
    try {
      localStorage.setItem(`result_${hallTicket}`, JSON.stringify({
        ...resultData,
        savedAt: new Date().toISOString(),
      }));
      return { success: true, message: 'Result saved locally' };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return { success: false, message: 'Failed to save result' };
    }
  }

  try {
    const filename = `result_${hallTicket}_${Date.now()}.json`;
    const data = JSON.stringify({
      ...resultData,
      savedAt: new Date().toISOString(),
    });
    
    await Filesystem.writeFile({
      path: filename,
      data,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    
    await hapticFeedback(ImpactStyle.Light);
    return { success: true, message: 'Result saved to device', filename };
  } catch (error) {
    console.error('Error saving result to device:', error);
    return { success: false, message: 'Failed to save result' };
  }
};

/**
 * Load saved results from local storage
 */
export const loadSavedResults = async () => {
  if (!isNative()) {
    // Web fallback: use localStorage
    try {
      const results: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('result_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              results.push(JSON.parse(data));
            } catch (e) {
              console.error('Error parsing saved result:', e);
            }
          }
        }
      }
      return results;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  try {
    const files = await Filesystem.readdir({
      path: '',
      directory: Directory.Data,
    });

    const results: any[] = [];
    for (const file of files.files) {
      if (file.name.startsWith('result_') && file.name.endsWith('.json')) {
        try {
          const fileData = await Filesystem.readFile({
            path: file.name,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
          });
          results.push(JSON.parse(fileData.data as string));
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
        }
      }
    }

    return results.sort((a, b) => {
      const dateA = new Date(a.savedAt || 0).getTime();
      const dateB = new Date(b.savedAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error loading saved results:', error);
    return [];
  }
};

/**
 * Check network connectivity
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if we can't check
};

/**
 * Get offline status
 */
export const isOffline = (): boolean => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return !navigator.onLine;
  }
  return false;
};

