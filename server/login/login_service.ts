import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {LogIn, User, AuthenticationResponse, ModelOptions} from '../../client/core/dto';
import {userService} from '../user/user_service';

export class LoginService {

	createOne(data: LogIn, options: ModelOptions = {}): Promise<AuthenticationResponse> {
		
		return new Promise<AuthenticationResponse>((resolve: Function, reject: Function) => {
		
			if (ObjectUtil.isBlank(data.username) || ObjectUtil.isBlank(data.password)) {
				return new Promise(function (fulfill, reject) {
				reject(new Error('Invalid credentials'));
				});
			}
		
			this.validateUser(data)
			.then((user: User) => {
				const authenticationResp: AuthenticationResponse = {};
				authenticationResp.token = this.getToken(user);
				resolve(authenticationResp);
			})
			.catch((err) => reject(err));
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
				requireAuthorization: false,
				copyAuthorizationData: '',
				validatePostSearchAuthData: false
			};
			
			userService.findOne(userData, userModelOptions)
			.then((user: User) => {
				if (ObjectUtil.isBlank(user)) {
					return reject(new Error('The user does not exist within this organization'));
				}
				if (!bcrypt.compareSync(data.password, user.password)) {
					return reject(new Error('Invalid password'));
				}
				resolve(user);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

}
 
export const loginService = new LoginService();