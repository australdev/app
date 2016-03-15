import {Payment, PaymentSearch, ModelOptions} from '../../client/core/dto';
import {PaymentModel, CoeModel, StudentModel, InstitutionModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {coeService} from '../coe/coe_service';
import {studyPeriodService} from '../study_period/study_period_service';

export class PaymentService extends BaseService<Payment> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'studyPeriod paymentType'
		};
		super(PaymentModel, defaultModelOptions);
	}

	downloadData(data: PaymentSearch, newOptions: ModelOptions = {}): Promise<Payment[]> {

		
		const studentPopulation = {
			path: 'student', 
			model: StudentModel,
			select: 'name'
		};
		
		const institutionPopulation = {
			path: 'institution', 
			model: InstitutionModel,
			select: 'name'
		};
		
		newOptions.population = [{
			path: 'studyPeriod',
			select: 'coe',
			populate: {
				path: 'coe', 
				model: CoeModel,
				select: 'student institution',
				populate: [studentPopulation, institutionPopulation]
			}
		},
		{
			path: 'paymentType'
		}];
		
		const dateRestrictions = {$lte: new Date()};
		
		if (data.startDate) {
			const sDate = new Date(data.startDate.toString());
			dateRestrictions['$gte'] = sDate ;
		} 
		
		if (data.endDate) {
			const eDate = new Date(data.endDate.toString());
			dateRestrictions['$lte'] = eDate ;
		}

		
		newOptions.additionalData = {
				 $or: [{ receivedValue: null}, { $where: 'this.receivedValue < this.expectedValue' }],
				 expectedDate: dateRestrictions
		};
		
		return new Promise<Payment[]>((resolve: Function, reject: Function) => {
			
			const modelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				distinct: '_id',
				additionalData: {}
			};
			
			// Add search filters
			if (data.student && data.student._id) {
				ObjectUtil.merge(modelOptions.additionalData, { 'student': data.student._id }); 
			}
			
			if (data.institution && data.institution._id) {
				ObjectUtil.merge(modelOptions.additionalData, { 'institution': data.institution._id });
			}
			
			coeService.findDistinct({}, modelOptions)
			.then((results: String[]) => {
				if (results.length > 0) {
					modelOptions.additionalData = { coe: { $in: results }};
					
					return studyPeriodService.findDistinct({}, modelOptions);
				} else {
					reject(new Error('There are not coes with those filters'));	
					return;
				}
			})
			.then((results: String[]) => {
				if (results.length > 0) {
					ObjectUtil.merge(newOptions.additionalData, { studyPeriod: { $in: results } });
					
					return this.find(data.payment, newOptions);
				} else {
					reject(new Error('There are not study periods with those filters'));
					return;	
				}
			})
			.then((results: Payment[]) => {
					resolve(results);
			})	
			.catch((err: Error) => {
				reject(err);
				return;
			});	
		});
	}
}

export const paymentService = new PaymentService();
