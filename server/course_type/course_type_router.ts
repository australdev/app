import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {courseTypeService} from './course_type_service';
import {CourseType, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  courseTypeService.createOne(req.body, modelOptions)
    .then((courseType: CourseType) => formatSend(res, courseType), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  courseTypeService.updateOne(req.body, modelOptions)
    .then((courseType: CourseType) => formatSend(res, courseType), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  courseTypeService.removeOneById(req.params.id, modelOptions)
    .then((courseType: CourseType) => formatSend(res, courseType), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  courseTypeService.find(req.query, modelOptions)
    .then((courseTypes: CourseType[]) => formatSend(res, courseTypes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  courseTypeService.findOneById(req.params.id, modelOptions)
    .then((courseType: CourseType) => formatSend(res, courseType), (err: any) => sendError(res, err));
});


export = router;


