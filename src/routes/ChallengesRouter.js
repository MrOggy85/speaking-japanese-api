import express from 'express';
import mongoose from 'mongoose';
import challenge from '../models/challenge';

import {
  parseId,
  parseJson,
  asyncUtil,
} from './helpers';

const ChallengesRouter = express.Router();

// Get all
ChallengesRouter.get('/', asyncUtil(async (req, res) => {
  const result = await challenge.find({}).exec();
  res.send(result);
}));

export default ChallengesRouter;
