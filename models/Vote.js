import mongoose from 'mongoose';

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    feedback: {
      type: Schema.Types.ObjectId,
      ref: 'Feedback',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Vote', voteSchema);
