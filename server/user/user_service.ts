import {User, AuthorizationData, ModelOptions} from '../../client/core/dto';
import {UserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class UserService extends BaseService<User> {

	constructor() {
		super(UserModel);
	}
	
	copySignificantAuthorizationData(data: User, modelOptions: ModelOptions = {}): void {
		const authorization = modelOptions.authorization;
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.user)) {
			data._id = authorization.user._id;
		}
	}

}

export const userService = new UserService();

