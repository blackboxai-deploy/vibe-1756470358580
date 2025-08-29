
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AudienceList = () => {
  const [audiences, setAudiences] = useState<any[]>([]);

  useEffect(() => {
    const fetchAudiences = async () => {
      const response = await fetch('/api/audience');
      const data = await response.json();
      setAudiences(data);
    };
    fetchAudiences();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audiences</CardTitle>
      </CardHeader>
      <CardContent>
        {audiences.length > 0 ? (
          <ul>
            {audiences.map((audience) => (
              <li key={audience.geofenceId} className="mb-2">
                <p className="font-bold">Geofence ID: {audience.geofenceId}</p>
                <p>Users: {audience.users.join(', ')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No audiences found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceList;

