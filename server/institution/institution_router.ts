import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {institutionService} from './institution_service';
import {Institution, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  institutionService.createOne(req.body, modelOptions)
    .then((institution: Institution) => formatSend(res, institution), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  institutionService.updateOne(req.body, modelOptions)
    .then((institution: Institution) => formatSend(res, institution), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  institutionService.removeOneById(req.params.id, modelOptions)
    .then((institution: Institution) => formatSend(res, institution), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  institutionService.find(req.query, modelOptions)
    .then((institutions: Institution[]) => formatSend(res, institutions), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  institutionService.findOneById(req.params.id, modelOptions)
    .then((institution: Institution) => formatSend(res, institution), (err: any) => sendError(res, err));
});


export = router;


