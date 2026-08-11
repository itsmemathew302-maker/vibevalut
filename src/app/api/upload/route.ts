import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin privileges required.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'audio' | 'image'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Checking if Cloudinary is configured
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key';

    if (!isCloudinaryConfigured) {
      // Return a simulated mock successful upload
      console.log('Cloudinary not configured. Mocking upload for:', file.name);
      
      let mockUrl = '';
      if (type === 'audio') {
        // High fidelity royalty free synthwave sample
        mockUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      } else {
        // Neon abstract music artwork
        const arts = [
          'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad'
        ];
        mockUrl = arts[Math.floor(Math.random() * arts.length)];
      }

      return NextResponse.json({
        success: true,
        url: mockUrl,
        public_id: 'mock_asset_' + Date.now()
      });
    }

    // Convert file to buffer for Cloudinary uploader stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: type === 'audio' ? 'video' : 'image', // Cloudinary handles audio files under video
          folder: 'vibevault',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (uploadResponse as any).secure_url,
      public_id: (uploadResponse as any).public_id
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
