import {Coe, ModelOptions} from '../../client/core/dto';
import {CoeModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class CoeService extends BaseService<Coe> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'student institution courseType'
		};
		super(CoeModel, defaultModelOptions);
	}

}

export const coeService = new CoeService();


