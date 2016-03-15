import {Institution, ModelOptions} from '../../client/core/dto';
import {InstitutionModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class InstitutionService extends BaseService<Institution> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: ''
		};
		super(InstitutionModel, defaultModelOptions);
	}

}

export const institutionService = new InstitutionService();


