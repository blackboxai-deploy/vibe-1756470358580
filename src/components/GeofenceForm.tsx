
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GeofenceForm = ({ onSave, geofence }: any) => {
  const [startTime, setStartTime] = useState(geofence?.startTime || '');
  const [endTime, setEndTime] = useState(geofence?.endTime || '');

  const handleSave = () => {
    onSave({ ...geofence, startTime, endTime });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Geofence Details</h2>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save Geofence</Button>
      </div>
    </div>
  );
};

export default GeofenceForm;

