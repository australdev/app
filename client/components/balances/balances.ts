namespace balances {

	angular.module('app.balances', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/balance';
		const url_student = '/api/student';
		const url_institution = '/api/institution';
		const url_coe = '/api/coe';
		
		$stateProvider
			.state('main.balances', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/balances' onto the urls of all its children.
				url: '/balances', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/balances/balances.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Balance';
					}
				]
			})
			
			/////////////////////
			//  > Students > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'balances' state.
			.state('main.balances.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/balances' (because '/balances' + '').
				url: '',
				
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'': {
						templateUrl: 'components/balances/balances.list.html',
								// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http', 'toastr',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService, toastr: any) {
							
							$scope.balanceSearch = { payment: {} };
							$scope.studyPeriodsAggGeneral = {};
							
							$http.get(`${url_institution}/_find`).then((resp: any) => {
								$scope.institutions = resp.data['data'];
							});
														
							$scope.searchBalance = function (data: any)  {
								
								$scope.balances = {};
								$scope.summary = {};
								
								$http.post(`${url}/_find`, data).then((resp) => {
									if (resp.data['success']) {
										$scope.balances = resp.data['data'];
									} else {
										toastr.info('There was an error the search could not be performed');
									}
								});
								
								if ($scope.balanceSearch.institution && $scope.balanceSearch.institution._id) {
									$http.get(`${url_coe}/_find_agg_balance?_id=${$scope.balanceSearch.institution._id}`).then((resp) => {
										$scope.summary = resp.data['data'];
									});
								}
							};
							
							$scope.downloadSearch = function (data: any)  {
								$http.post(`${url}/_download`, data).then((resp) => {
									if (resp.data['success']) {
										const file = resp.data['data'];
										const buf = new ArrayBuffer(file.length);
										const view = new Uint8Array(buf);
										for ( let i = 0; i !== file.length; ++i) {
											view[i] = file.charCodeAt(i) & 0xFF;
										}
										const blob = new Blob([buf], {type: 'application/octet-stream'});
										saveAs(blob, 'Balance.xlsx');
									}
								});
							};
						}]
					}
				}
			});
	}
}
