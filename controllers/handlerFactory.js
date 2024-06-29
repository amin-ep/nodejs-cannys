import catchAsync from '../utils/catchAsync.js';
import HTTPError from '../errors/httpError.js';

class Factory {
  constructor(Model, createValidator, updateValidator) {
    this.Model = Model;
    this.createValidator = createValidator;
    this.updateValidator = updateValidator;
  }

  getAll = catchAsync(async (req, res, next) => {
    const docs = await this.Model.find();

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs,
      },
    });
  });

  getOne = catchAsync(async (req, res, next) => {
    const doc = await this.Model.findById(req.params.id);

    if (!doc) {
      return next(new HTTPError(`Invalid Id: ${req.params.id}`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

  createOne = catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id; //FIXME

    const { error } = this.createValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

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
    const { error } = this.updateValidator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message, 400));
    }

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
