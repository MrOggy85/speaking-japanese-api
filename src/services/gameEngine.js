import winston from '../config/winston';

import challengeModel from '../models/challenge';

import getAdjectiveGameObject from './adjectivesGame';

const GAME_TYPE = {
  ADJECTIVES: 'adjectives',
};

function getGame(gameType) {
  switch (gameType.toLowerCase()) {
    case GAME_TYPE.ADJECTIVES:
      return getAdjectiveGameObject;
    default: {
      const err = new Error(`no such gameType "${gameType}".
      Valid games are: ${Object.values(GAME_TYPE)}
      `);
      err.status = 400;
      throw err;
    }
  }
}

async function getChallengeFromDb(gameType) {
  const result = await challengeModel.find({
    name: gameType,
  }).exec();

  if (result.length === 0) {
    const err = new Error(`no such challenge found for "${gameType}".`);
    throw err;
  }

  return result[0];
}

/* eslint-disable import/prefer-default-export */
export async function getNextQuestion(gameType) {
  const game = getGame(gameType);

  const challenge = await getChallengeFromDb(gameType);
  winston.debug(`getNextQuestion challenge ${challenge.name}, with tags ${challenge.tags}`);

  const gameObject = await game(Array.from(challenge.tags));
  return gameObject;
}
