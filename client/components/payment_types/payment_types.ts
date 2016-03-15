namespace paymentTypes {

	angular.module('app.paymentTypes', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/payment-type';
					
		$stateProvider
			.state('paymentTypes', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/paymentTypes' onto the urls of all its children.
				url: '/payment-type', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/payment_types/payment_types.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Payment Type';
					}
				]
			})
			
			/////////////////////
			//  > PaymentTypes > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'paymentTypes' state.
			.state('paymentTypes.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/paymentTypes' (because '/paymentTypes' + '').
				url: '',
		
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within paymentTypes.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/payment_types/payment_types.list.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
					
					$scope.deletePaymentType = function (data: any)  {
						let result: boolean = confirm('Are you sure? All the information related to this coe will be lost!');
						if (result) {
							$http.delete(`${url}/${data._id}`).then((resp) => {
								if (resp.data['success']) {
									$state.go($state.current, {}, {reload: true});
								}
							});
						} 
					};
					
					$http.get(`${url}/_find`).then((resp) => {
						$scope.paymentTypes = resp.data['data'];
					});
				}]
			})
      
			/////////////////////
			//  > PaymentTypess > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'paymentTypes' state.
			  .state('paymentTypes.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/paymentTypes' (because '/paymentTypes' + '').
				url: '/:paymentTypeId',
		  
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within _pArents_paymentTypes.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/payment_types/payment_types.edit.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				  function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
				
					$scope.editPaymentType = function (paymentType: any)  {	  
					  if (paymentType._id) {           
						$http.put(`${url}/${paymentType._id}`, paymentType).then((resp) => {
						  if (resp.data['success']) {
							$state.go('paymentTypes.list');
						  }
						});  
					  } else {
						$http.post(`${url}`, paymentType).then((resp) => {
						  if (resp.data['success']) {
							$state.go('paymentTypes.list');
						  }
						});
					  }
					};
					  
					if ($stateParams.paymentTypeId) {
						$http.get(`${url}/${$stateParams.paymentTypeId}`).then((resp) => {
							$scope.paymentType = resp.data['data'];
						});
					}
					
				}]
			});
	}
			
}
