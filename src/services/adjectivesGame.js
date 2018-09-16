import { getRandomInt } from '../utils/utils';
import {
  baseForms,
  politeLevel,
  adjectiveForms,
} from '../utils/forms';

import gameObject from '../models/viewModels/gameObject';
import adjective from '../models/adjective';

function getQuestion(sampleSentence, conjugation, subject, politenessLevel, pronoun) {
  let beConjugated;
  switch (conjugation) {
    case baseForms.PRESENT:
    case baseForms.PRESENT_NEG:
      beConjugated = 'is';
      break;
    case baseForms.PAST:
    case baseForms.PAST_NEG:
      beConjugated = 'was';
      break;
    default:
      throw new Error(`be conjugation "${conjugation}" is not implemented`);
  }

  let polarity;
  switch (conjugation) {
    case baseForms.PRESENT:
    case baseForms.PAST:
      polarity = '';
      break;
    case baseForms.PAST_NEG:
    case baseForms.PRESENT_NEG:
      polarity = 'not ';
      break;
    default:
      throw new Error(`polarity for "${conjugation}" is not implemented`);
  }

  const question = sampleSentence
    .replace('$beConjugation', beConjugated)
    .replace('$subject', subject)
    .replace('$polarity', polarity)
    .replace('$pronoun', pronoun);

  return `${question} (${politenessLevel})`;
}

function getAnswer(subject, stem, suffix, pronoun, politenessLevel) {
  let pronounJap = '';
  if (pronoun) {
    switch (pronoun) {
      case 'it':
        pronounJap = '';
        break;
      case 'that':
        pronounJap = 'その';
        break;
      case 'this':
        pronounJap = 'この';
        break;
      default:
        throw new Error(`translation for "${pronoun}" is not implemented in japanese`);
    }
  }

  const answers = [];
  answers.push(`${pronounJap}${subject}は${stem}${suffix}`);

  if (politenessLevel === politeLevel.SHORT) {
    answers.push(`${pronounJap}${subject}${stem}${suffix}`);
  }

  return answers;
}

function getConjugatedSubjectEng(subject, conjugation) {
  if (subject !== 'day') {
    return subject;
  }

  switch (conjugation) {
    case baseForms.PRESENT:
    case baseForms.PRESENT_NEG:
      return 'Today';
    case baseForms.PAST:
    case baseForms.PAST_NEG:
      return 'Yesterday';
    default:
      throw new Error(`conjugation "${conjugation}" not implemented english`);
  }
}

function getConjugatedSubjectJap(noun, conjugation) {
  if (noun.en !== 'day') {
    return noun.ja;
  }

  switch (conjugation) {
    case baseForms.PRESENT:
    case baseForms.PRESENT_NEG:
      return '今日';
    case baseForms.PAST:
    case baseForms.PAST_NEG:
      return '昨日';
    default:
      throw new Error(`conjugation "${conjugation}" not implemented for japanese`);
  }
}

async function getAdjectivesByTags(tags) {
  const result = await adjective.find({
    tags: { $in: tags },
  }).exec();

  if (result.length === 0) {
    const err = new Error(`no challenge items found with tags: ${tags}.`);
    throw err;
  }

  return result;
}

export default async function getAdjectiveGameObject(tags) {
  const adjectives = await getAdjectivesByTags(tags);
  const index = getRandomInt(adjectives.length);
  const item = adjectives[index];

  const politenessIndex = getRandomInt(Object.keys(politeLevel).length);
  const politenessLevel = Object.values(politeLevel)[politenessIndex];

  const conjugationIndex = getRandomInt(Object.keys(baseForms).length);
  const conjugation = Object.values(baseForms)[conjugationIndex];

  const subjectEng = getConjugatedSubjectEng(item.noun.en, conjugation);
  const question = getQuestion(item.sampleSentence, conjugation, subjectEng, politenessLevel, item.pronoun);

  const subjectJap = getConjugatedSubjectJap(item.noun, conjugation);
  const suffix = adjectiveForms[item.type][politenessLevel][conjugation];

  const answers = getAnswer(subjectJap, item.stem, suffix, item.pronoun, politenessLevel);

  return {
    ...gameObject,
    question,
    answers,
    hint: answers[0],
  };
}
