import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  songId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userImage?: string;
  content: string;
  rating: number; // 1 to 5 star ratings
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userImage: { type: String, default: '' },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 }
}, { timestamps: true });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
