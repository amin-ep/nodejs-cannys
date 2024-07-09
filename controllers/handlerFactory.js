import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeautures.js';

class Factory {
  constructor(Model) {
    this.Model = Model;
  }

  getAll = catchAsync(async (req, res) => {
    const features = new APIFeatures(this.Model.find(), req.query)
      .filter()
      .limit()
      .paginate()
      .sort();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs,
      },
    });
  });

  getOne = catchAsync(async (req, res) => {
    const doc = await this.Model.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

  createOne = catchAsync(async (req, res) => {
    const newDoc = await this.Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  });

  deleteOne = catchAsync(async (req, res, next) => {
    await this.Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  updateOne = catchAsync(async (req, res, next) => {
    const updatedDoc = await this.Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedDoc,
      },
    });
  });
}

export default Factory;
