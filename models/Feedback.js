import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      trim: true,
      index: true,
    },
    body: {
      String,
    },
    images: [String],
    slug: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

feedbackSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    trim: true,
  });
  next();
});

feedbackSchema.virtual('voters', {
  ref: 'Vote',
  foreignField: 'feedback',
  localField: '_id',
});

feedbackSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'feedback',
  localField: '_id',
});

feedbackSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'fullName',
  })
    .populate({
      path: 'voters',
      select: 'user -feedback',
    })
    .populate({
      path: 'comments',
      select: 'text user -feedback',
    });
  next();
});

export default mongoose.model('Feedback', feedbackSchema);
