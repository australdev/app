import {StudyPeriod, ModelOptions} from '../../client/core/dto';
import {StudyPeriodModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class StudyPeriodService extends BaseService<StudyPeriod> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{
					path: 'coe',
					populate: [
						{
							path: 'institution',
							model: 'institution'
						},
						{
							path: 'student',
							model: 'student'
						}
					]
				},
				{
					path: 'frequency'		
				}
			]
		};
		super(StudyPeriodModel, defaultModelOptions);
	}

}

export const studyPeriodService = new StudyPeriodService();


