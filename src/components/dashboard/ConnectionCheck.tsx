import React, { useEffect, useState, ReactNode } from 'react';
import { Button, Card, CardBody } from '@heroui/react';

interface ConnectionCheckProps {
  children: ReactNode;
}

export const ConnectionCheck = ({ children }: ConnectionCheckProps) => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/spotify/connection-status');
        const data = await response.json();
        setConnected(data.connected);
      } catch (error) {
        console.error('Error checking connection status:', error);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleConnectSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/connect');
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error connecting to Spotify:", err);
      alert("Failed to connect to Spotify");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Card className="max-w-md w-full bg-primary text-text-primary shadow-lg">
          <CardBody className="p-6 flex flex-col items-center text-center">
            <div className="mb-6 text-7xl">🎵</div>
            <h2 className="text-2xl font-bold mb-3">Connect to Spotify</h2>
            <p className="mb-6">
              To view your Spotify insights, you need to connect your account first.
            </p>
            <Button 
              color="success" 
              size="lg" 
              className="font-medium"
              onClick={handleConnectSpotify}
            >
              Connect Now
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 