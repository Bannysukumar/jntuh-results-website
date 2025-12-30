"use client";

import { useEffect, useState } from 'react';
import { loadSavedResults, isNative, hapticFeedback } from '@/lib/native-features';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Share2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { shareContent } from '@/lib/native-features';
import { ImpactStyle } from '@capacitor/haptics';

interface SavedResult {
  details?: {
    rollNumber?: string;
    name?: string;
  };
  savedAt?: string;
  [key: string]: any;
}

/**
 * Component to display and manage saved results
 */
export default function SavedResults() {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isNativeApp = isNative();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const results = await loadSavedResults();
      setSavedResults(results);
    } catch (error) {
      console.error('Error loading saved results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (result: SavedResult) => {
    await hapticFeedback(ImpactStyle.Medium);
    const rollNumber = result.details?.rollNumber;
    if (rollNumber) {
      router.push(`/academicresult/result?htno=${rollNumber}`);
    }
  };

  const handleShare = async (result: SavedResult) => {
    await hapticFeedback(ImpactStyle.Light);
    const rollNumber = result.details?.rollNumber || 'N/A';
    const name = result.details?.name || 'Student';
    
    await shareContent({
      title: `JNTUH Result - ${rollNumber}`,
      text: `Check out ${name}'s JNTUH result (Hall Ticket: ${rollNumber})`,
      url: `https://manajntuhresults.vercel.app/academicresult/result?htno=${rollNumber}`,
      dialogTitle: 'Share Result',
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading saved results...</p>
      </div>
    );
  }

  if (savedResults.length === 0) {
    return (
      <div className="p-4">
        <Card className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            No saved results yet. Results you save will appear here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-lg font-semibold mb-4">Saved Results ({savedResults.length})</h3>
      {savedResults.map((result, index) => {
        const rollNumber = result.details?.rollNumber || 'N/A';
        const name = result.details?.name || 'Unknown';
        const savedDate = result.savedAt 
          ? new Date(result.savedAt).toLocaleDateString()
          : 'Unknown date';

        return (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">{name}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Hall Ticket: <span className="font-mono">{rollNumber}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Saved: {savedDate}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewResult(result)}
                  className="h-8"
                >
                  View
                </Button>
                {isNativeApp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(result)}
                    className="h-8"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

