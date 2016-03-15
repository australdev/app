import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {frequencyService} from './frequency_service';
import {Frequency, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  frequencyService.createOne(req.body, modelOptions)
    .then((frequency: Frequency) => formatSend(res, frequency), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  frequencyService.updateOne(req.body, modelOptions)
    .then((frequency: Frequency) => formatSend(res, frequency), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  frequencyService.removeOneById(req.params.id, modelOptions)
    .then((frequency: Frequency) => formatSend(res, frequency), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  frequencyService.find(req.query, modelOptions)
    .then((frequencies: Frequency[]) => formatSend(res, frequencies), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  frequencyService.findOneById(req.params.id, modelOptions)
    .then((frequency: Frequency) => formatSend(res, frequency), (err: any) => sendError(res, err));
});


export = router;


