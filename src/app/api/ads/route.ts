
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const adsFilePath = path.join(process.cwd(), 'data', 'ads.json');
const audiencesFilePath = path.join(process.cwd(), 'data', 'audiences.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const audiencesFileContents = fs.readFileSync(audiencesFilePath, 'utf8');
    const audiences = JSON.parse(audiencesFileContents);

    const adsFileContents = fs.readFileSync(adsFilePath, 'utf8');
    const ads = JSON.parse(adsFileContents);

    const userAudiences = audiences.filter((audience: any) => audience.users.includes(userId));

    if (userAudiences.length === 0) {
        return NextResponse.json([]);
    }

    const adsToServe = ads.filter((ad: any) => {
        return userAudiences.some((audience: any) => {
            const adStartDate = new Date(ad.startDate).getTime();
            const adEndDate = new Date(ad.endDate).getTime();
            const now = new Date().getTime();

            if (ad.geofenceId === audience.geofenceId && now >= adStartDate && now <= adEndDate) {
                return true;
            }
            return false;
        });
    });

    return NextResponse.json(adsToServe);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching ads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const fileContents = fs.readFileSync(adsFilePath, 'utf8');
        const ads = JSON.parse(fileContents);
        ads.push(body);
        fs.writeFileSync(adsFilePath, JSON.stringify(ads, null, 2));
        return NextResponse.json({ message: 'Ad created successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating ad' }, { status: 500 });
    }
}
