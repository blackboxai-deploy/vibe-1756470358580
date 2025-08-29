
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdManager = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({ geofenceId: '', creative: '', startDate: '', endDate: '' });

  useEffect(() => {
    const fetchAds = async () => {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data);
    };
    fetchAds();
  }, []);

  const handleCreateAd = async () => {
    await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAd),
    });
    setNewAd({ geofenceId: '', creative: '', startDate: '', endDate: '' });
    const response = await fetch('/api/ads');
    const data = await response.json();
    setAds(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <Input
            placeholder="Geofence ID"
            value={newAd.geofenceId}
            onChange={(e) => setNewAd({ ...newAd, geofenceId: e.target.value })}
          />
          <Input
            placeholder="Ad Creative URL"
            value={newAd.creative}
            onChange={(e) => setNewAd({ ...newAd, creative: e.target.value })}
          />
          <Input
            type="datetime-local"
            value={newAd.startDate}
            onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
          />
          <Input
            type="datetime-local"
            value={newAd.endDate}
            onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
          />
          <Button onClick={handleCreateAd}>Create Ad</Button>
        </div>
        <div>
          <h3 className="font-bold">Existing Ads</h3>
          {ads.length > 0 ? (
            <ul>
              {ads.map((ad) => (
                <li key={ad.id} className="mb-2">
                  <p>Geofence ID: {ad.geofenceId}</p>
                  <p>Creative: {ad.creative}</p>
                  <p>Start Date: {ad.startDate}</p>
                  <p>End Date: {ad.endDate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ads found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdManager;
