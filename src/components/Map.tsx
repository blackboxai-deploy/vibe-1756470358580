
// @ts-nocheck
'use client';

import { MapContainer, TileLayer, Circle, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

const Map = ({ onGeofenceDrawn, geofences }: any) => {
  const handleCreate = (e: any) => {
    onGeofenceDrawn(e.layer.toGeoJSON());
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreate}
          draw={{
            rectangle: false,
            polygon: false,
            circle: true,
            marker: false,
            polyline: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
      {geofences.map((geofence: any) => (
        <Circle
          key={geofence.id}
          center={[geofence.location.lat, geofence.location.lon]}
          radius={geofence.radius}
          color="blue"
        />
      ))}
    </MapContainer>
  );
};

export default Map;

