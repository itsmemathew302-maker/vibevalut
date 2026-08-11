import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artistId: mongoose.Types.ObjectId;
  artistName: string; // Cached for easy queries
  albumId?: mongoose.Types.ObjectId;
  albumTitle?: string; // Cached
  audioUrl: string; // Cloudinary or storage link
  coverUrl: string; // Cloudinary or storage link
  duration: number; // in seconds
  lyrics?: string;
  genres: string[];
  playsCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true, index: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true, index: true },
  artistName: { type: String, required: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album' },
  albumTitle: { type: String, default: '' },
  audioUrl: { type: String, required: true },
  coverUrl: { type: String, required: true },
  duration: { type: Number, required: true, default: 0 },
  lyrics: { type: String, default: '' },
  genres: [{ type: String, index: true }],
  playsCount: { type: Number, default: 0, index: true },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

const Song: Model<ISong> = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
export default Song;
