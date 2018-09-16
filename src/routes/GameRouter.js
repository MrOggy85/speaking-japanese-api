import express from 'express';
import { getNextQuestion } from '../services/gameEngine';

import {
  parseId,
  asyncUtil,
} from './helpers';

const GameRouter = express.Router();

// Get by id
GameRouter.get('/:id/next', asyncUtil(async (req, res) => {
  const challengeId = parseId(req);

  const gameObject = await getNextQuestion(challengeId);

  res.send(gameObject);
}));

export default GameRouter;
