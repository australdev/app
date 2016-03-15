namespace payments {

	angular.module('app.payments', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/payment';
		const url_student = '/api/student';
		const url_institution = '/api/institution';
		
		$stateProvider
			.state('payments', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/payments' onto the urls of all its children.
				url: '/payments', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/payments/payments.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Payments';
					}
				]
			})
			
			/////////////////////
			//  > Students > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'payments' state.
			.state('payments.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/payments' (because '/payments' + '').
				url: '',
		
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within payments.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/payments/payments.list.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
					
					$scope.paymentSearch = { payment: {} };
					
					$http.get(`${url_student}/_find`).then((resp: any) => {
					  $scope.students = resp.data['data'];
					});
					
					$http.get(`${url_institution}/_find`).then((resp: any) => {
					  $scope.institutions = resp.data['data'];
					});
												
					$scope.searchPayments = function (data: any)  {
						$http.post(`${url}/_search_overdue`, data).then((resp) => {
							if (resp.data['success']) {
								$scope.payments = resp.data['data'];
							}
						});
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
								saveAs(blob, 'Payments.xlsx');
							}
						});
					};
				}]
			});
	}
}
