import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {studyPeriodService} from './study_period_service';
import {StudyPeriod, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studyPeriodService.createOne(req.body, modelOptions)
    .then((studyPeriod: StudyPeriod) => formatSend(res, studyPeriod), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  studyPeriodService.updateOne(req.body, modelOptions)
    .then((studyPeriod: StudyPeriod) => formatSend(res, studyPeriod), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studyPeriodService.removeOneById(req.params.id, modelOptions)
    .then((studyPeriod: StudyPeriod) => formatSend(res, studyPeriod), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  studyPeriodService.find(req.query, modelOptions)
    .then((studyPeriods: StudyPeriod[]) => formatSend(res, studyPeriods), (err: any) => sendError(res, err));
});

router.get('/_find_unpop', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    population: ''
  };
  studyPeriodService.find(req.query, modelOptions)
    .then((studyPeriods: StudyPeriod[]) => formatSend(res, studyPeriods), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  studyPeriodService.findOneById(req.params.id, modelOptions)
    .then((studyPeriod: StudyPeriod) => formatSend(res, studyPeriod), (err: any) => sendError(res, err));
});


export = router;


