import { useState, useEffect } from 'react';
import { HomePageData } from './types';

export const usePreferenceCount = (): HomePageData => {
  const [preferenceCount, setPreferenceCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
        // API call to get preferences count
        const response = await fetch('/api/mongodb/preferences');
        const data = await response.json();
        
        setPreferenceCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching preference count:', error);
        setPreferenceCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCount();
  }, []);
  
  return { 
    preferenceCount, 
    loading, 
    isQuestionnaireUnlocked: preferenceCount >= 50 
  };
}; 