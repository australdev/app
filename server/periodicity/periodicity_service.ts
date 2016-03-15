import {Periodicity, ModelOptions} from '../../client/core/dto';
import {PeriodicityModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class PeriodicityService extends BaseService<Periodicity> {

	constructor() {
		super(PeriodicityModel);
	}
}

export const periodicityService = new PeriodicityService();
