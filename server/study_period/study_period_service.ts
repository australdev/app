import {StudyPeriod, ModelOptions, Coe} from '../../client/core/dto';
import {StudyPeriodModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {paymentService} from '../payment/payment_service';

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

	aggregateStudyPeriodsPerCoe(coe: Coe):  Promise<any> {

		return new Promise<any>((resolve: Function, reject: Function) => {
			
			const aggregationCondition = [
				{ $match: { coe: coe._id } },
				{ $group: { _id: '$coe' , 
							expectedPerCoe: { $sum: '$expectedComm' },
							receivedPerCoe: { $sum: '$periodGts' } 
						}
				}
			];
			
			this.Model.aggregate(aggregationCondition).exec((err, results) => {
				if (err) {
					return reject(err);
				}
				
				resolve(results[0]);
			});
			
		});
	}
	
	aggregateStudyPeriodsMultipleCoe(coeIds: string[]): Promise<any> {
		
		return new Promise<any>((resolve: Function, reject: Function) => {
			
			let fakeId: Coe = null;
			const aggregationCondition = [
				{ $match: { coe: { $in: coeIds } } },
				{ $group: { _id: fakeId, 
							expectedPerSchool: { $sum: '$expectedComm' },
							receivedPerSchool: { $sum: '$periodGts' }
						} 
				}
			];
			
			this.Model.aggregate(aggregationCondition).exec((err, results) => {
				if (err) {
					return reject(err);
				}
				
				resolve(results[0]);
			});
			
		});
	}
	
	aggregateReceivedAmountPerStudyPeriod(data: StudyPeriod, newOptions: ModelOptions = {}): Promise<any> {
		
		return new Promise<any>((resolve: Function, reject: Function) => {
			this.find(data, newOptions)
			.then((studyPeriods: StudyPeriod[]) => {
				const loadAggregationPayments: Promise<StudyPeriod>[] = [];
				
				for (let i = 0; i < studyPeriods.length; i++) {
					loadAggregationPayments.push(paymentService.aggregateReceivedAmountPerStudyPeriod(studyPeriods[0]));	
				}
				
				return Promise.all(loadAggregationPayments);
			})
			.then((results: any) => {
				resolve(results[0]);
			})	
			.catch((err: Error) => {
				reject(err);
			});	
		});
	}
	
	aggregateReceivedAmountPerCoe(data: Coe, newOptions: ModelOptions = {}): Promise<any> {
		return new Promise<any>((resolve: Function, reject: Function) => {
			newOptions.distinct = '_id';
			this.findDistinct({}, newOptions)
			.then((studyPeriods: string[]) => {
				console.log('studyPeriods ' + JSON.stringify(studyPeriods));
				return paymentService.aggregateReceivedAmountMultipleStudyPeriods(studyPeriods, data);
			})
			.then((results: any) => {
				resolve(results);
			})	
			.catch((err: Error) => {
				reject(err);
			});	
		});	
	}

}

			

export const studyPeriodService = new StudyPeriodService();


