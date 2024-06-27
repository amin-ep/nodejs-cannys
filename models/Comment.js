import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    feedback: {
      type: Schema.Types.ObjectId,
      ref: 'Feedback',
      index: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    text: {
      type: String,
    },
    images: [String],
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'fullName',
  });
  next();
});

commentSchema.pre('find', function (next) {
  this.find({ published: { $ne: false } });
  next();
});

export default mongoose.model('Comment', commentSchema);
