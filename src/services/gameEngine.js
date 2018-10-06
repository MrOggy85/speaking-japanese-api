import winston from '../config/winston';

import challengeModel from '../models/challenge';

import getAdjectiveGameObject from './adjectivesGame';
import getSimpleGameObject from './simpleGame';

const GAME_TYPE = {
  ADJECTIVES: 'adjectives',
  SIMPLE: 'simple',
};

function getGame(gameType) {
  switch (gameType.toLowerCase()) {
    case GAME_TYPE.ADJECTIVES:
      return getAdjectiveGameObject;
    case GAME_TYPE.SIMPLE:
      return getSimpleGameObject;
    default: {
      const err = new Error(`no such gameType "${gameType}".
      Valid games are: ${Object.values(GAME_TYPE)}
      `);
      err.status = 400;
      throw err;
    }
  }
}

async function getChallengeFromDb(gameName) {
  const result = await challengeModel.find({
    name: gameName,
  }).exec();

  if (result.length === 0) {
    const err = new Error(`no such challenge found for "${gameName}".`);
    throw err;
  }

  return result[0];
}

/* eslint-disable import/prefer-default-export */
export async function getNextQuestion(gameName) {
  const challenge = await getChallengeFromDb(gameName);
  winston.debug(`getNextQuestion challenge ${challenge.name}, with tags ${challenge.tags}`);

  const game = getGame(challenge.type);

  const gameObject = await game(Array.from(challenge.tags));
  return gameObject;
}
