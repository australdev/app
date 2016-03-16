import {StudyPeriod, Payment} from '../../core/dto';


namespace coes {

	angular.module('app.coes', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/coe';
		const url_studyPeriod = '/api/study-period';
		const url_frequency = '/api/frequency';
		const url_payment = '/api/payment';
		const url_paymentType = '/api/payment-type';
		const url_courseType = '/api/course-type';
		const url_student = '/api/student';
		const url_institution = '/api/institution';
					
		$stateProvider
			.state('main.coes', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/coes' onto the urls of all its children.
				url: '/coes', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/coes/coes.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
					}]
			})
			
			/////////////////////
			//  > Coes > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'coes' state.
			.state('main.coes.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/coes' (because '/coes' + '').
				url: '',
		
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within coes.html. This is the
				// most important thing to remember about templates.
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'table-content': {
						templateUrl: 'components/coes/coes.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService, $toast: any) {
							
							$scope.texts.title = 'Coe';
							
							$scope.coeParams = {};
							
							$scope.deleteCoe = function (data: any)  {
								let result: boolean = confirm('Are you sure? All the information related to this coe will be lost!');
								if (result) {
									$http.delete(`${url}/${data.id}`).then((resp) => {
										if (resp.data['success']) {
											$state.go($state.current, {}, {reload: true});
										} else {
											
										}
									});
								}; 
							};
							
							$scope.loadCoes = function (data: any)  {
								$http({
									url: `${url}/_find`, 
									method: 'GET',
									params: data
								}).then((resp) => {
									$scope.coes = resp.data['data'];
								});
							};
							
						}]
					}
				}
			})
      
			/////////////////////
			//  > Coes > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'coes' state.
			.state('main.coes.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/coes' (because '/coes' + '').
				url: '/:coeId',
		  
		  		views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'table-content': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within _pArents_coes.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/coes/coes.edit.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.texts.title = 'Coe';
							$scope.studentFilter = {};
							
							$scope.loadStudents = function ()  {
								$http.get(`${url_student}/_find`).then((resp: any) => {
									$scope.students = resp.data['data'];
								});
							};
							
							$http.get(`${url_student}/_find`).then((resp: any) => {
								$scope.students = resp.data['data'];
							});
								
							$http.get(`${url_institution}/_find`).then((resp: any) => {
								$scope.institutions = resp.data['data'];
							});
							
							$http.get(`${url_courseType}/_find`).then((resp: any) => {
								$scope.courseTypes = resp.data['data'];
							});
							
							$scope.editCoe = function (coe: any)  {
								if (coe._id) {           
									$http.put(`${url}/${coe._id}`, coe).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.list');
										}
									});  
								} else {
									$http.post(`${url}`, coe).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.list');
										}
									});
								}
							};
							
							if ($stateParams.coeId) {
								$http.get(`${url}/${$stateParams.coeId}`).then((resp) => {
									$scope.coe = resp.data['data'];
									
									$scope.texts.title = 'Coe ' + $scope.coe.student.name + ' - ' + $scope.coe.institution.name;
									
									$scope.coe.startDate = new Date($scope.coe.startDate);
									$scope.coe.endDate = new Date($scope.coe.endDate);
								});
							}
						}]
					}
				 }
			})
			
			
			
			.state('main.coes.studyPeriods', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/studyPeriods' onto the urls of all its children.
				url: '/:coeId/study-periods', 
				
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'table-content': {
						// Example of loading a template from a file. This is also a top level state,
						// so this template file will be loaded and then inserted into the ui-view
						// within index.html.
						templateUrl: 'components/coes/coes.study_periods.html'
					}
				}
			})
			
			/////////////////////
			// coes. > StudyPeriods > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'studyPeriods' state.
			.state('main.coes.studyPeriods.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/studyPeriods' (because '/studyPeriods' + '').
				url: '',
		
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'sp-table-content': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within studyPeriods.html. This is the
						// most important thing to remember about templates.*/
						templateUrl: 'components/coes/coes.study_periods.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.texts.title = 'Coe - Study Period';
							
							$scope.coeId = $stateParams.coeId;
							$scope.summary = '';
							
							$http.get(`${url}/${$stateParams.coeId}`).then((resp) => {
								$scope.coe = resp.data['data'];
								
								$scope.texts.title = 'Coe ' + $scope.coe.student.name + ' - ' + $scope.coe.institution.name + ' - Study Period';
							});
							
							$scope.deleteStudyPeriod = function (data: any)  {
								let result: boolean = confirm('Are you sure? All the information related to this study period will be lost!');
								if (result) {
									$http.delete(`${url_studyPeriod}/${data.id}`).then((resp) => {
										if (resp.data['success']) {
											const filters = {
												coeId: $scope.coe._id	
											};
											$state.go($state.current, filters, {reload: true});
										}
									}); 
								}
							};
							
							$http.get(`${url_studyPeriod}/_find?coe=${$stateParams.coeId}`).then((resp) => {
								$scope.studyPeriods = resp.data['data'];
							});
							
							$http.get(`${url_studyPeriod}/_find_agg_coe?_id=${$stateParams.coeId}`).then((resp) => {
								$scope.summary = resp.data['data'];
							});
				
						}]
					}
				}
			})
      
			/////////////////////
			// Coes > StudyPeriods > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'studyPeriods' state.
			  .state('main.coes.studyPeriods.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/studyPeriods' (because '/studyPeriods' + '').
				url: '/:studyPeriodId',
		  
		  		views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'sp-table-content': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within _pArents_studyPeriods.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/coes/coes.study_periods.edit.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.texts.title = 'Coe - Study Period';
							
							$scope.coeId = $stateParams.coeId;
							
							$http.get(`${url_frequency}/_find`).then((resp) => {
								$scope.frequencies = resp.data['data'];
							});
							
							$scope.editStudyPeriod = function (studyPeriod: any, coe: any)  {
								const filters = {
									coeId: coe._id	
								};
								
								if (studyPeriod._id) {           
									$http.put(`${url_studyPeriod}/${studyPeriod._id}`, studyPeriod).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.studyPeriods.list', filters);
										}
									});  
								} else {
									if ($scope.coe._id) {
										studyPeriod['coe'] = $scope.coe._id;
									}
									$http.post(`${url_studyPeriod}`, studyPeriod).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.studyPeriods.list', filters);
										}
									});
								}
							};
							
							if ($scope.coeId) {
								$http.get(`${url}/${$scope.coeId}`).then((resp) => {
									$scope.coe = resp.data['data'];
									
									$scope.texts.title = 'Coe - ' + $scope.coe.student.name + ' - ' + $scope.coe.institution.name + ' - Study Period';
								});
							}
							
							if ($stateParams.studyPeriodId) {
								$http.get(`${url_studyPeriod}/${$stateParams.studyPeriodId}`).then((resp) => {
									$scope.studyPeriod = resp.data['data'];
									$scope.studyPeriod.startDate = new Date($scope.studyPeriod.startDate);
									$scope.studyPeriod.endDate = new Date($scope.studyPeriod.endDate);
								});
							}
							
						}]
					}
				  }
			})
			
			/////////////////////
			// Payments 
			/////////////////////
			
			.state('main.coes.studyPeriods.payments', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/payments' onto the urls of all its children.
				url: '/:studyPeriodId/payments', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'sp-table-content': {
						// Example of loading a template from a file. This is also a top level state,
						// so this template file will be loaded and then inserted into the ui-view
						// within index.html.
						templateUrl: 'components/coes/coes.study_periods.payments.html'
					}
				}
			})
			
			/////////////////////
			// coes.studyPeriods > Payments > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'payments' state.
			.state('main.coes.studyPeriods.payments.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/payments' (because '/payments' + '').
				url: '',
		
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'p-table-content': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within payments.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/coes/coes.study_periods.payments.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.texts.title = 'Coe - Study Period - Payment';
							
							$scope.coeId = $stateParams.coeId;
							$scope.studyPeriodId = $stateParams.studyPeriodId;
							
							$http.get(`${url_studyPeriod}/${$stateParams.studyPeriodId}`).then((resp) => {
								$scope.studyPeriod = resp.data['data'];
								
								$scope.texts.title = 'Coe - ' + $scope.studyPeriod.coe.student.name + ' - ' + 
								$scope.studyPeriod.coe.institution.name + ' - Study Period - Payment';
							});
							
							$scope.isOverdue = function (payment: Payment)  {
								if (payment && payment.expectedDate) {
									const currentDate = new Date();
									const expDate = new Date(payment.expectedDate.toString());
									if ((!payment.receivedValue || payment.receivedValue < payment.expectedValue) && 
										(currentDate > expDate)) {
										return true;
									}
								}
								return false;
							};
							
							$scope.deletePayment = function (data: any)  {
								let result: boolean = confirm('Are you sure? All the information related to this payment will be lost!');
								if (result) {
									$http.delete(`${url_payment}/${data.id}`).then((resp) => {
										if (resp.data['success']) {
											$state.go($state.current, {}, {reload: true});
										}
									});
								} 
							};
												
							$http.get(`${url_payment}/_find?studyPeriod=${$stateParams.studyPeriodId}`).then((resp) => {
								$scope.payments = resp.data['data'];
							});
							
							$http.get(`${url_studyPeriod}/_find_agg_study?_id=${$stateParams.studyPeriodId}`).then((resp) => {
								$scope.summary = resp.data['data'];
							});
						}]
					}
				}
			})
      
			/////////////////////
			// coes.studyPeriods > Payments > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'payments' state.
			  .state('main.coes.studyPeriods.payments.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/payments' (because '/payments' + '').
				url: '/:paymentId',
		  
		  		views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'p-table-content': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within _pArents_payments.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/coes/coes.study_periods.payments.edit.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.texts.title = 'Coe - Study Period - Payment';
							$scope.coeId = $stateParams.coeId;
							$scope.studyPeriodId = $stateParams.studyPeriodId;
							$scope.payment = {};
							
							$http.get(`${url_paymentType}/_find`).then((resp: any) => {
								$scope.paymentTypes = resp.data['data'];
							});
							
							$scope.editPayment = function (payment: any, studyPeriod: any)  {
							
								const filters = {
									coeId: studyPeriod.coe._id,
									studyPeriodId: studyPeriod._id	
								};
								
								if (payment._id) {           
									$http.put(`${url_payment}/${payment._id}`, payment).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.studyPeriods.payments.list', filters);
										}
									});  
								} else {
									if (studyPeriod._id) {
										payment['studyPeriod'] = studyPeriod._id;
									}
									$http.post(`${url_payment}`, payment).then((resp) => {
										if (resp.data['success']) {
											$state.go('coes.studyPeriods.payments.list', filters);
										}
									});
								}
							};
							
							$scope.calcComm = function ()  {
								const payment: Payment = $scope.payment;
								
								if (payment && payment.commPerc && payment.coursePayment) {
									payment.expectedComm = payment.coursePayment * payment.commPerc / 100;
									payment.paymentGts = payment.expectedComm / 10;
									payment.expectedValue = payment.expectedComm + payment.paymentGts;
								}
							};
							
							$scope.receivedDateChange = function ()  {
								const payment: Payment = $scope.payment;
								if (payment && !payment.expectedDate && payment.receivedDate) {
									payment.expectedDate = payment.receivedDate;
								}
							};
							
							$scope.receivedValueChange = function ()  {
								const payment: Payment = $scope.payment;
								if (payment && !payment.expectedValue && payment.receivedValue) {
									payment.expectedValue = payment.receivedValue;
								}
							};
							
							if ($stateParams.studyPeriodId) {
								$http.get(`${url_studyPeriod}/${$stateParams.studyPeriodId}`).then((resp) => {
									$scope.studyPeriod = resp.data['data'];
									
									$scope.texts.title = 'Coe - ' + $scope.studyPeriod.coe.student.name + ' - ' + 
									$scope.studyPeriod.coe.institution.name + ' - Study Period - Payment';
								
									// Data initialization based on parent's
									if (!$scope.payment['frequency']) {
										$scope.payment['frequency'] = $scope.studyPeriod.frequency.description;	
									}
									
									if (!$scope.payment['commPerc']) {
										$scope.payment['commPerc'] = $scope.studyPeriod.commPerc;	
									}

								});
							}
							
							if ($stateParams.paymentId) {
								$http.get(`${url_payment}/${$stateParams.paymentId}`).then((resp) => {
									$scope.payment = resp.data['data'];
									$scope.payment.expectedDate = new Date($scope.payment.expectedDate);
									if ($scope.payment.receivedDate) {
										$scope.payment.receivedDate = new Date($scope.payment.receivedDate);
									}
								});
							}
						}]
			  		}
				}
			});
	}
			
}
