import express from 'express';

import {
  parseId,
  parseJson,
  asyncUtil,
} from './helpers';

const GameRouter = express.Router();

// Get by id
GameRouter.get('/:id', asyncUtil(async (req, res)=> {
  const id = parseId(req);
  var promise1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000, 'foo');
  });
  const result = await promise1;

  res.send({ result });
}));

export default GameRouter;
