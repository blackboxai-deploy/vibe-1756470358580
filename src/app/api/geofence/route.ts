
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'geofences.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const geofences = JSON.parse(fileContents);
    return NextResponse.json(geofences);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading geofences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const geofences = JSON.parse(fileContents);
    geofences.push(body);
    fs.writeFileSync(dataFilePath, JSON.stringify(geofences, null, 2));
    return NextResponse.json({ message: 'Geofence added successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding geofence' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        let geofences = JSON.parse(fileContents);
        geofences = geofences.filter((geofence: any) => geofence.id !== id);
        fs.writeFileSync(dataFilePath, JSON.stringify(geofences, null, 2));
        return NextResponse.json({ message: 'Geofence deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting geofence' }, { status: 500 });
    }
}
