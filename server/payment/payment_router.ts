import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {paymentService} from './payment_service';
import {Payment, ModelOptions} from '../../client/core/dto';
import {xlsxService} from '../xlsx/xlsx_service';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  paymentService.createOne(req.body, modelOptions)
    .then((payment: Payment) => formatSend(res, payment), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: { _id: req.params.id }
  };
  paymentService.updateOne(req.body, modelOptions)
    .then((payment: Payment) => formatSend(res, payment), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  paymentService.removeOneById(req.params.id, modelOptions)
    .then((payment: Payment) => formatSend(res, payment), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  paymentService.find(req.query, modelOptions)
    .then((payments: Payment[]) => formatSend(res, payments), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  paymentService.findOneById(req.params.id, modelOptions)
    .then((payment: Payment) => formatSend(res, payment), (err: any) => sendError(res, err));
});

router.post('/_search_overdue', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  paymentService.downloadData(req.body, modelOptions)
    .then((payments: Payment[]) => formatSend(res, payments), (err: any) => sendError(res, err));
});

router.post('/_download', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  
  try {
        const file = xlsxService.printPayments(req.body);
        formatSend(res, file);
    } catch (error) {
      sendError(res, error);
    }
});

export = router;


