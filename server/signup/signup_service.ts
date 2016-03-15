import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';

import {loginService} from '../login/login_service';
import {userService} from '../user/user_service';
import {SignUp, User, ModelOptions, AuthenticationResponse} from '../../client/core/dto';


export class SignupService {
	
	createOne(data: SignUp = {}, options: ModelOptions = {}): Promise<AuthenticationResponse> {
		return new Promise<AuthenticationResponse>((fulfill: Function, reject: Function) => {
		options.requireAuthorization = false; // As it doesn't need authorization validation it can be skipped
		userService.createOne(data.user, options)
		.then((user: User) => {
			data._id = user._id;
			const response = {
				token: loginService.getToken(data.user)
			};
			fulfill(response);
		})
		.catch((err) => {
			if (ObjectUtil.isPresent(data._id)) {
				userService.removeOneById(data._id, options);
			} 
			reject(err); 
			});
		});
	}
	
}
 
export const signupService = new SignupService();