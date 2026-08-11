import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  bio?: string;
  imageUrl: string;
  genres: string[];
  followersCount: number;
  userFollowers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true, unique: true, index: true },
  bio: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  genres: [{ type: String }],
  followersCount: { type: Number, default: 0, index: true },
  userFollowers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Artist: Model<IArtist> = mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema);
export default Artist;
