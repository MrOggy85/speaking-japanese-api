import { getRandomInt } from '../utils/utils';

import gameObject from '../models/viewModels/gameObject';
import sentence from '../models/sentence';

async function getSentencesByTags(tags) {
  const result = await sentence.find({
    tags: { $in: tags },
  }).exec();

  if (result.length === 0) {
    const err = new Error(`no challenge items found with tags: ${tags}.`);
    throw err;
  }

  return result;
}

export default async function getSimpleGameObject(tags) {
  const sentences = await getSentencesByTags(tags);
  const index = getRandomInt(sentences.length);
  const item = sentences[index];

  return {
    ...gameObject,
    question: item.en,
    answers: item.ja,
    hint: item.ja[0],
  };
}
