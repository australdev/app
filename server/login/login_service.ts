import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {LogIn, User, AuthenticationResponse, ModelOptions} from '../../client/core/dto';
import {userService} from '../user/user_service';


export class LoginService {

	createOne(data: LogIn, options: ModelOptions = {}): Promise<string> {
		
		if (ObjectUtil.isBlank(data.username) || ObjectUtil.isBlank(data.password)) {
			return new Promise(function (fulfill, reject) {
			  reject(new Error('Invalid credentials'));
			});
    	}

		return new Promise<string>((resolve: Function, reject: Function) => {
			this.validateUser(data)
			.then((user: User) => {
				const authenticationResp: AuthenticationResponse = {};
				authenticationResp.token = this.getToken(user);
				resolve(authenticationResp);
		}, (err: any) => reject(err));
		});
	}

	getToken(user: User) {
		const days = 1; // 1 day
		const expires = (Date.now() + (days * 24 * 60 * 60 * 1000));

		const payload = { 
			sub: user._id,
			exp: expires 
		};
		const token = encode(payload, process.env.AUSTRAL_SECRET);

		return token;
	}

	private validateUser(data: LogIn): Promise<User> {
		return new Promise<User>((resolve: Function, reject: Function) => {
            const userData = {
                userName: data.username
            };
			const userModelOptions: ModelOptions = {
				requireAuthorization: false
			}; 
			userService.findOne(userData, userModelOptions)
			.then((user: User) => {
				if (ObjectUtil.isBlank(user)) {
					reject(new Error('The user does not exist within this organization'));
					return;
				}
				if (!bcrypt.compareSync(data.password, user.password)) {
					reject(new Error('Invalid password'));
					return;
				}
				resolve(user);
			})
			.catch((err) => {
				return reject(err);
			});
		});
	}

}
 
export const loginService = new LoginService();