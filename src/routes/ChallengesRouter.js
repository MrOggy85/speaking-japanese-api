import express from 'express';
import challenge from '../models/challenge';

import {
  asyncUtil,
} from './helpers';

const ChallengesRouter = express.Router();

// Get all
ChallengesRouter.get('/', asyncUtil(async (req, res) => {
  const challenges = await challenge.find({}).exec();
  res.send(challenges);
}));

export default ChallengesRouter;
