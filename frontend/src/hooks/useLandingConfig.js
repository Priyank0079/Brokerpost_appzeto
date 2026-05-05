import { useState, useEffect } from 'react';
import * as landingConfigService from '../modules/admin/services/landingConfigService';

export const useLandingConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await landingConfigService.getLandingConfig();
        console.log('Landing Config Response:', response);
        if (response.success) {
          setConfig(response.data);
        } else {
          console.error('Landing Config Error:', response.message);
          setError('Failed to fetch configuration');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
