import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {userService} from './user_service';
import {User, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)  
  };
  userService.createOne(req.body, modelOptions)
    .then((user: User) => formatSend(res, user), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: {_id: req.params.id}
  };
  userService.updateOne(req.body, modelOptions)
    .then((user: User) => formatSend(res, user), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  userService.removeOneById(req.params.id, modelOptions)
    .then((user: User) => formatSend(res, user), (err) => sendError(res, err));
});

router.get('/_find', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  userService.find(req.query, modelOptions)
    .then((users: User[]) => formatSend(res, users), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false
  };
  userService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  userService.findOneById(req.params.id, modelOptions)
    .then((user: User) => formatSend(res, user), (err: any) => sendError(res, err));
});


export = router;

