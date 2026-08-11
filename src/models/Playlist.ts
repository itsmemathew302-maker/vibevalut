import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  coverUrl?: string;
  userId: mongoose.Types.ObjectId; // Creator reference
  userName: string; // Cached creator name
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  playsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  coverUrl: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  isPublic: { type: Boolean, default: true },
  playsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Playlist: Model<IPlaylist> = mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
export default Playlist;
