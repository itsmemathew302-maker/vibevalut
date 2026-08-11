import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecentlyPlayed {
  songId: mongoose.Types.ObjectId;
  playedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  image?: string;
  role: 'admin' | 'user';
  favorites: mongoose.Types.ObjectId[];
  followedArtists: mongoose.Types.ObjectId[];
  playlists: mongoose.Types.ObjectId[];
  recentlyPlayed: IRecentlyPlayed[];
  createdAt: Date;
  updatedAt: Date;
}

const RecentlyPlayedSchema = new Schema<IRecentlyPlayed>({
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  playedAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  image: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  followedArtists: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  recentlyPlayed: [RecentlyPlayedSchema]
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
