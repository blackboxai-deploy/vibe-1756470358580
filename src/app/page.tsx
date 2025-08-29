
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import GeofenceForm from '@/components/GeofenceForm';
import AudienceList from '@/components/AudienceList';
import AdManager from '@/components/AdManager';

const Page = () => {
  const [geofences, setGeofences] = useState<any[]>([]);
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null);

  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { ssr: false }), []);

  useEffect(() => {
    const fetchGeofences = async () => {
      const response = await fetch('/api/geofence');
      const data = await response.json();
      setGeofences(data);
    };
    fetchGeofences();
  }, []);

  const handleGeofenceDrawn = (geoJson: any) => {
    const { coordinates } = geoJson.geometry;
    const [lon, lat] = coordinates;
    const radius = geoJson.properties.radius;
    setSelectedGeofence({ location: { lat, lon }, radius });
  };

  const handleSaveGeofence = async (geofence: any) => {
    const response = await fetch('/api/geofence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geofence),
    });
    if (response.ok) {
      const newGeofences = await fetch('/api/geofence');
      const data = await newGeofences.json();
      setGeofences(data);
      setSelectedGeofence(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="md:col-span-2 h-[500px]">
         <Map onGeofenceDrawn={handleGeofenceDrawn} geofences={geofences} />
      </div>
      <div className="flex flex-col gap-4">
        {selectedGeofence && (
          <GeofenceForm onSave={handleSaveGeofence} geofence={selectedGeofence} />
        )}
        <AudienceList />
        <AdManager />
      </div>
    </div>
  );
};

export default Page;
