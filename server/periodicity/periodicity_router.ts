import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {periodicityService} from './periodicity_service';
import {Periodicity, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  periodicityService.createOne(req.body, modelOptions)
    .then((periodicity: Periodicity) => formatSend(res, periodicity), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  periodicityService.updateOne(req.body, modelOptions)
    .then((periodicity: Periodicity) => formatSend(res, periodicity), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  periodicityService.removeOneById(req.params.id, modelOptions)
    .then((periodicity: Periodicity) => formatSend(res, periodicity), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  periodicityService.find(req.query, modelOptions)
    .then((periodicitys: Periodicity[]) => formatSend(res, periodicitys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  periodicityService.findOneById(req.params.id, modelOptions)
    .then((periodicity: Periodicity) => formatSend(res, periodicity), (err: any) => sendError(res, err));
});


export = router;


