import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {balanceService} from './balance_service';
import {Balance, ModelOptions} from '../../client/core/dto';
import {xlsxService} from '../xlsx/xlsx_service';

const router = express.Router();

router.post('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true
  };
  balanceService.downloadBalance(req.body, modelOptions)
    .then((balances: Balance[]) => formatSend(res, balances), (err: any) => sendError(res, err));
});

router.post('/_download', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  
  try {
        const file = xlsxService.printBalance(req.body);
        formatSend(res, file);
    } catch (error) {
      sendError(res, error);
    }
});

export = router;


