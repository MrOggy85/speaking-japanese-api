import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const base = {
  _id: ObjectId,
  name: { type: String, default: '' },
  created: { type: Date },
  modified: { type: Date },
};

export default base;
