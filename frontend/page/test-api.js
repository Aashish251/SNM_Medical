'use client'; // Add this if using App Router

import { useState, useEffect } from 'react';
import ApiService from '@/lib/api'; // Adjust path as needed

export default function TestApiPage() {
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.testConnection();
      setBackendData(response);
      console.log('Backend response:', response);
    } catch (err) {
      setError(err.message);
      console.error('Connection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Frontend-Backend Connection Test</h1>
      
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {backendData && (
        <div style={{ marginTop: '20px' }}>
          <strong>Success! Backend Response:</strong>
          <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
            {JSON.stringify(backendData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
