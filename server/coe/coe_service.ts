import {Coe, ModelOptions, FilterResponse, CoeFilter} from '../../client/core/dto';
import {CoeModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {studentService} from '../student/student_service';
import {institutionService} from '../institution/institution_service';
import {studyPeriodService} from '../study_period/study_period_service';
import {ObjectUtil} from '../../client/core/util';


export class CoeService extends BaseService<Coe> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'student institution courseType'
		};
		super(CoeModel, defaultModelOptions);
	}

	findWithFilters(data: any, newOptions: ModelOptions = {}): Promise<Coe[]> {

		return new Promise<Coe[]>((resolve: Function, reject: Function) => {
			
			const preSearchPromises: Promise<FilterResponse>[] = [];
			preSearchPromises.push(studentService.findPreFilterResponse({ name: data['studentName']}, newOptions));
			preSearchPromises.push(institutionService.findPreFilterResponse({ name: data['institutionName'] }, newOptions));
			
			Promise.all(preSearchPromises)						
			.then((preConditions: FilterResponse[]) => {
				newOptions.additionalData = {};
				
				//Check if there should be a filter by student
				const studentFilter = preConditions[0];
				if (studentFilter.wereThereFilters) {
					newOptions.additionalData['student'] = { $in: studentFilter.distinctArray };
				}
				
				//Check if there should be a filter by institution
				const institutionFilter = preConditions[1];
				if (institutionFilter.wereThereFilters) {
					newOptions.additionalData['institution'] = { $in: institutionFilter.distinctArray };
				}
				
				delete data.studentName;
				delete data.institutionName;
				return this.find(data, newOptions);
			})
			.then((foundObjects: Coe[]) => {
				resolve(foundObjects);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}
	
	aggregateReceivedAmountPerCoe(data: Coe, newOptions: ModelOptions = {}): Promise<any> {
		return new Promise<any>((resolve: Function, reject: Function) => {
			
			const studyPeriodOptions = ObjectUtil.clone(newOptions);
			newOptions.distinct = '_id';
			this.findDistinct({}, newOptions)
			.then((coes: string[]) => {
				studyPeriodOptions.additionalData = { coe: { $in: coes } };
				return studyPeriodService.aggregateReceivedAmountPerCoe(data, studyPeriodOptions);
			})
			.then((results: Coe) => {
				resolve(results);
			})	
			.catch((err: Error) => {
				reject(err);
			});	
		});	
	}
	
	aggregateForBalance(data: Coe, newOptions: ModelOptions = {}): Promise<any> {
		return new Promise<any>((resolve: Function, reject: Function) => {
			
			const studyPeriodOptions = ObjectUtil.clone(newOptions);
			
			newOptions.distinct = '_id';
			this.findDistinct({}, newOptions)
			.then((coes: string[]) => {
				
				const loadAggregation: Promise<any>[] = [];
				
				studyPeriodOptions.additionalData = { coe: { $in: coes } };
				loadAggregation.push(studyPeriodService.aggregateReceivedAmountPerCoe(data, studyPeriodOptions));
				
				loadAggregation.push(studyPeriodService.aggregateStudyPeriodsMultipleCoe(coes));
				
				return Promise.all(loadAggregation);
			})
			.then((results: any) => {
				const summary = {
					p: results[0],
					sp: results[1]
				};
				resolve(summary);
			})	
			.catch((err: Error) => {
				reject(err);
			});	
		});	
	}
}

export const coeService = new CoeService();


