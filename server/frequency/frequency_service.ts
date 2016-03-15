import {Frequency, ModelOptions} from '../../client/core/dto';
import {FrequencyModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class FrequencyService extends BaseService<Frequency> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'minPeriod'
		};
		super(FrequencyModel, defaultModelOptions);
	}

}

export const frequencyService = new FrequencyService();


