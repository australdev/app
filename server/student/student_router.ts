import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {studentService} from './student_service';
import {Student, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studentService.createOne(req.body, modelOptions)
    .then((student: Student) => formatSend(res, student), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  studentService.updateOne(req.body, modelOptions)
    .then((student: Student) => formatSend(res, student), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studentService.removeOneById(req.params.id, modelOptions)
    .then((student: Student) => formatSend(res, student), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  studentService.find(req.query, modelOptions)
    .then((students: Student[]) => formatSend(res, students), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studentService.findOneById(req.params.id, modelOptions)
    .then((student: Student) => formatSend(res, student), (err: any) => sendError(res, err));
});


export = router;


