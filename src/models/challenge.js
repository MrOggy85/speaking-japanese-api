import mongoose from 'mongoose';
import base from './base';

const challenge = {
  ...Object.assign({}, base),

  tags: { type: [String], default: [] },
  created: { type: Date },
  modified: { type: Date },
  type: String,
};

export default mongoose.model('challenge', challenge);
