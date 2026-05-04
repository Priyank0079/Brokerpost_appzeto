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
        if (response.success) {
          setConfig(response.data);
        } else {
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
