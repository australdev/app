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
		
		if (NON_SECURED_URL.indexOf(req.originalUrl.split('?')[0]) > -1) {
			return next();
		}
		
		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) 
			|| (req.headers && ((req.headers['x-access-token']) 
			|| (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]))) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			return next(new Error('Invalid Token'));
		}
		
		try {
			const decoded = decode(token, process.env.AUSTRAL_SECRET);
			
			if (decoded.exp <= Date.now()) {
				return next(new Error('Token expired'));
			}
			
			//query id_organization (ido), id_lead (idl)
			const idSessionParams = {
				ido: (req.query.ido ? req.query.ido : req.body.ido),
				idl: (req.query.idl ? req.query.idl : req.body.idl)
			};
			
			const userModelOptions: ModelOptions = {
				requireAuthorization: false
			}; 
					
			userService.findOneById(decoded.sub, userModelOptions)
			.then((user: User) => {
				if (user._id) {
					req.body.austral.user = user;	
				}
				
				return next();
			})
			.catch((err) => {
				return next(err);
			});
			
		} catch (err) {
			return next(new Error('Token could not be verified'));
		}
	}
}

export const authentication = new Authentication();