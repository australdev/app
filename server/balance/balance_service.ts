import {Balance, BalanceSearch, Coe, StudyPeriod, Payment, Student, Institution, ModelOptions} from '../../client/core/dto';
import {PaymentModel, CoeModel, StudentModel, InstitutionModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {coeService} from '../coe/coe_service';
import {studyPeriodService} from '../study_period/study_period_service';
import {paymentService} from '../payment/payment_service';
import {studentService} from '../student/student_service';
import {institutionService} from '../institution/institution_service';

export class BalanceService {

	constructor() {
		
	}

	downloadBalance(data: BalanceSearch, studyPeriodOptions: ModelOptions = {}): Promise<Balance[]> {

		return new Promise<Balance[]>((resolve: Function, reject: Function) => {
			
			const studentPopulation = {
				path: 'student', 
				model: StudentModel,
				select: 'name'
			};
			
			const institutionPopulation = {
				path: 'institution', 
				model: InstitutionModel,
				select: 'name monthsDivision'
			};
			
			studyPeriodOptions.population = {
				path: 'coe', 
				model: CoeModel,
				select: 'student institution startDate endDate',
				populate: [studentPopulation, institutionPopulation]
			};
		
		
			const coeModelOptions: ModelOptions = {
				authorization: studyPeriodOptions.authorization,
				distinct: '_id',
				additionalData: {},
				population: ''
			};
						
			if (data.institution && data.institution._id) {
				ObjectUtil.merge(coeModelOptions.additionalData, { 'institution': data.institution._id });
			}
			
			coeService.findDistinct({}, coeModelOptions)
			.then((results: string[]) => {
				if (results.length > 0) {
					studyPeriodOptions.additionalData = { coe: { $in: results } };
					return studyPeriodService.find({}, studyPeriodOptions);
				} else {
					return reject(new Error('There are not coes with those filters'));	
				}
			})
			.then((studyPeriods: StudyPeriod[]) => {
				if (studyPeriods.length > 0) {
					const childrenModelOptions = {
						authorization: studyPeriodOptions.authorization
					};
					
					const promises: Promise<StudyPeriod>[] = [];
					for (let i = 0; i < studyPeriods.length; i++) {
						promises.push(this.calculateReceivedPerStudyPeriod(studyPeriods[i], childrenModelOptions));
					}
					return Promise.all(promises);
				} else {
					reject(new Error('There are not study periods with those filters'));
					return;	
				}
			})
			.then((results: StudyPeriod[]) => {
				const coes = {};
				const balance: Balance[] = [];
				// Group study periods per coe
				for (let i = 0; i < results.length; i++) {
					if (ObjectUtil.isBlank(coes[results[i].coe._id])) {
						coes[results[i].coe._id] = [results[i]]; 
					} else {
						coes[results[i].coe._id].push(results[i]);
					}
				}
				//Create balances
				for (let prop in coes) {
					const bal: Balance = {expectedAmount: 0, receivedAmount: 0, remainingAmount: 0, expectedCommission: 0, expectedGts: 0};
					for (let i = 0; i < coes[prop].length; i++) {	
						const studyPeriod: StudyPeriod = coes[prop][i];
						bal.coe = studyPeriod.coe;
						bal.expectedCommission += studyPeriod.expectedComm;
						bal.expectedGts += studyPeriod.periodGts;
						bal.expectedAmount += studyPeriod.expectedAmount;
						bal.receivedAmount += studyPeriod.receivedAmount;
					}
					
					bal.remainingAmount = bal.expectedAmount - bal.receivedAmount;
					balance.push(bal);
				}
				resolve(balance);
			})	
			.catch((err: Error) => {
				reject(err);
				return;
			});	
		});
	}
	
	private calculateReceivedPerStudyPeriod(data: StudyPeriod,  childrenModelOptions: ModelOptions = {}): Promise<StudyPeriod> {
		const studyPeriodToSend: StudyPeriod = data;
		return new Promise<StudyPeriod>((fulfill: Function, reject: Function) => {
			paymentService.find({ studyPeriod: data._id}, childrenModelOptions) 
			.then((payments: Payment[]) => {
				let received = 0;
				if (payments.length > 0) {
					for (let i = 0; i < payments.length; i++) {
						if (ObjectUtil.isPresent(payments[i].receivedValue)) {
							received += payments[i].receivedValue;
						}
					}
				}
				studyPeriodToSend.expectedAmount = ObjectUtil.getNumber(studyPeriodToSend.expectedComm) + 
					ObjectUtil.getNumber(studyPeriodToSend.periodGts);
				studyPeriodToSend.receivedAmount = received;
				studyPeriodToSend.remainingAmount = studyPeriodToSend.expectedAmount - received;
				fulfill(studyPeriodToSend);
			})
			.catch((err: any) => {
				reject(err);
				return;
			});
		});
	}

}

export const balanceService = new BalanceService();
