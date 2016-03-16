import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {User, ModelOptions, AuthorizationData} from '../../client/core/dto';
import {userService} from '../user/user_service';


const NON_SECURED_URL: string[] = ['/api/user/_exist',
	'/api/signup',
	'/api/login'];
		
export class Authentication {

	validate(req: express.Request, res: express.Response, next: Function) {
		
		req.body.austral = {};
		
		// Stores the invitation id or object in the AuthorizationData Object		
		/*const invitation = (req.query.inv ? req.query.inv : req.body.inv);
		if (ObjectUtil.isPresent(invitation)) {
			req.body.cymplarRole['invitation'] = ObjectUtil.clone(invitation);
			delete req.query.inv;
			delete req.body.inv;
		}*/
		
		if (NON_SECURED_URL.indexOf(req.originalUrl.split('?')[0]) > -1) {
			return next();
		}
		
		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) 
			|| (req.headers && ((req.headers['x-access-token']) 
			|| (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]))) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			return sendError(res, new Error('Token is required'), { token: false });
		}
		
		try {	
			const decoded = decode(token, process.env.AUSTRAL_SECRET);
		
			if (ObjectUtil.isBlank(decoded.sub)) {
				return sendError(res, new Error('Invalid Token'), { token: false });
			}
			
			if (decoded.exp <= Date.now()) {
				return sendError(res, new Error('Token expired'), { token: false });
			}
			
			//query id_organization (ido), id_lead (idl)
			const idSessionParams = {
				ido: (req.query.ido ? req.query.ido : req.body.ido),
				idl: (req.query.idl ? req.query.idl : req.body.idl)
			};
			
			const userModelOptions: ModelOptions = {
				requireAuthorization: false,
				copyAuthorizationData: ''
			}; 
					
			userService.findOneById(decoded.sub, userModelOptions)
			.then((user: User) => {
				if (ObjectUtil.isPresent(user)) {
					req.body.austral.user = user;	
				}
				
				return next();
			})
			.catch((err) => {
				return sendError(res, err, { token: false });
			});
		} catch (err) {
			return sendError(res, err, { token: false });
		}
	}
}

export const authentication = new Authentication();