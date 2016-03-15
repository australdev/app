import {CourseType, ModelOptions} from '../../client/core/dto';
import {CourseTypeModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class CourseTypeService extends BaseService<CourseType> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: ''
		};
		super(CourseTypeModel, defaultModelOptions);
	}

}

export const courseTypeService = new CourseTypeService();


