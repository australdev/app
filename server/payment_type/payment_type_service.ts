import {PaymentType, ModelOptions} from '../../client/core/dto';
import {PaymentTypeModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class PaymentTypeService extends BaseService<PaymentType> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'studyPeriod'
		};
		super(PaymentTypeModel, defaultModelOptions);
	}

}

export const paymentTypeService = new PaymentTypeService();


