import express from 'express';

import {
  parseId,
  parseJson,
  asyncUtil,
} from './helpers';

const ChallengesRouter = express.Router();

// Get all
ChallengesRouter.get('/', asyncUtil(async (req, res) => {
  res.send([
    {
      id: 1,
      name: 'adjectives',
    },
    {
      id: 2,
      name: 'sentences',
    },
  ]);
}));

export default ChallengesRouter;
