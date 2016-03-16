import {Student, ModelOptions} from '../../client/core/dto';
import {StudentModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class StudentService extends BaseService<Student> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'school client frequency'
		};
		super(StudentModel, defaultModelOptions);
	}
}

export const studentService = new StudentService();


