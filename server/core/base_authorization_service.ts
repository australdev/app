import {Model, Document} from 'mongoose';

import {BaseDto, ModelOptions, AuthorizationData} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';

export class BaseAuthorizationService<T extends BaseDto>{
	
	protected isCreateAuthorized(modelOptions: ModelOptions = {}, data?: T): any {
		if (modelOptions.requireAuthorization) {
			return this.evaluateCreationAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateCreationAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
		if (!this.existsUser(modelOptions.authorization)) {
			return 'Unauthorized user';
		}
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions = {}, data?: T): any {
		if (modelOptions.requireAuthorization) {
			return this.evaluateUpdateAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateUpdateAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
		if (!this.existsUser(modelOptions.authorization)) {
			return 'Unauthorized user';
		}
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions = {}, data?: T): any {
		if (modelOptions.requireAuthorization) {
			return this.evaluateRemoveAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateRemoveAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
		if (!this.existsUser(modelOptions.authorization)) {
			return 'Unauthorized user';
		}
	}
	
	protected isSearchAuthorized(modelOptions: ModelOptions = {}, data?: T): any {
		if (modelOptions.requireAuthorization) {
			return this.evaluateSearchAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateSearchAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
		if (!this.existsUser(modelOptions.authorization)) {
			return 'Unauthorized user';
		}
	}
		
	protected isUpdateAuthorizedExecution(modelOptions: ModelOptions = {}, data?: T): any {
		if (!modelOptions.requireAuthorization) {
			return this.evaluateUpdateExecutionAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateUpdateExecutionAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
	}
	
	protected isRemoveAuthorizedExecution(modelOptions: ModelOptions = {}, data?: T): any {
		if (!modelOptions.requireAuthorization) {
			return this.evaluateRemoveExecutionAuthorization(modelOptions, data);
		}
	}
	
	protected evaluateRemoveExecutionAuthorization(modelOptions: ModelOptions = {}, data?: T): any {
	}
	
	protected existsUser(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.user)) {
			return false;
		}
		return true;
	}

}