import mongoose from 'mongoose';
import base from './base';

const adjective = {
  ...Object.assign({}, base),

  tags: { type: [String], default: [] },

  en: { type: String, default: '' },
  stem: { type: String, default: '' },
  type: { type: String, default: '' },
  noun: {
    en: String,
    ja: String,
  },
  pronoun: { type: String, default: '' },
  sampleSentence: { type: String, default: '' },
};

export default mongoose.model('challengeItem', adjective);
