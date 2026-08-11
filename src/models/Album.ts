import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artistId: mongoose.Types.ObjectId;
  artistName: string;
  coverUrl: string;
  releaseDate: Date;
  genres: string[];
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbum>({
  title: { type: String, required: true, index: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true, index: true },
  artistName: { type: String, required: true },
  coverUrl: { type: String, required: true },
  releaseDate: { type: Date, default: Date.now },
  genres: [{ type: String }],
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

const Album: Model<IAlbum> = mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
export default Album;
