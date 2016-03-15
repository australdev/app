import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {coeService} from './coe_service';
import {Coe, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  coeService.createOne(req.body, modelOptions)
    .then((coe: Coe) => formatSend(res, coe), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  coeService.updateOne(req.body, modelOptions)
    .then((coe: Coe) => formatSend(res, coe), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  coeService.removeOneById(req.params.id, modelOptions)
    .then((coe: Coe) => formatSend(res, coe), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  coeService.find(req.query, modelOptions)
    .then((coes: Coe[]) => formatSend(res, coes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  coeService.findOneById(req.params.id, modelOptions)
    .then((coe: Coe) => formatSend(res, coe), (err: any) => sendError(res, err));
});


export = router;


