
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'audiences.json');
const geofencesFilePath = path.join(process.cwd(), 'data', 'geofences.json');

export async function POST(request: Request) {
  try {
    const { userId, location } = await request.json();

    const geofencesFileContents = fs.readFileSync(geofencesFilePath, 'utf8');
    const geofences = JSON.parse(geofencesFileContents);

    const audiencesFileContents = fs.readFileSync(dataFilePath, 'utf8');
    const audiences = JSON.parse(audiencesFileContents);

    for (const geofence of geofences) {
      const distance = getDistance(location, geofence.location);
      if (distance < geofence.radius) {
        const now = new Date().getTime();
        const startTime = new Date(geofence.startTime).getTime();
        const endTime = new Date(geofence.endTime).getTime();

        if (now >= startTime && now <= endTime) {
          const audience = audiences.find((aud: any) => aud.geofenceId === geofence.id);
          if (audience) {
            if (!audience.users.includes(userId)) {
              audience.users.push(userId);
            }
          } else {
            audiences.push({ geofenceId: geofence.id, users: [userId] });
          }
        }
      }
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(audiences, null, 2));
    return NextResponse.json({ message: 'Audience updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating audience' }, { status: 500 });
  }
}

function getDistance(location1: any, location2: any) {
  const R = 6371e3; // metres
  const φ1 = location1.lat * Math.PI/180; // φ, λ in radians
  const φ2 = location2.lat * Math.PI/180;
  const Δφ = (location2.lat-location1.lat) * Math.PI/180;
  const Δλ = (location2.lon-location1.lon) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const audiences = JSON.parse(fileContents);
        return NextResponse.json(audiences);
    } catch (error) {
        return NextResponse.json({ message: 'Error reading audiences' }, { status: 500 });
    }
}
