namespace frequencies {

	angular.module('app.frequencies', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {

		const url = '/api/frequency';
		const url_periodicity = '/api/periodicity';
	
		$stateProvider
			.state('main.frequencies', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/frequencies' onto the urls of all its children.
				url: '/frequency', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/frequencies/frequencies.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Frequency';
						
						$http.get(`${url_periodicity}/_find`).then((resp: any) => {
							$scope.periodicities = resp.data['data'];
						});
					}
				]
			})
			
			/////////////////////
			//  > Frequencies > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'frequencies' state.
			.state('main.frequencies.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/frequencies' (because '/frequencies' + '').
				url: '',
				
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within frequencies.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/frequencies/frequencies.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.deleteFrequency = function (data: any)  {
								let result: boolean = confirm('Are you sure?');
								if (result) {
									$http.delete(`${url}/${data.id}`).then((resp) => {
										if (resp.data['success']) {
											$state.go($state.current, {}, {reload: true});
										}
									});
								} 
							};
							
							$http.get(`${url}/_find`).then((resp) => {
								$scope.frequencies = resp.data['data'];
							});
						}]
					}
				}
			})
      
			/////////////////////
			//  > Frequenciess > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'frequencies' state.
			  .state('main.frequencies.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/frequencies' (because '/frequencies' + '').
				url: '/:frequencyId',
		  
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within _pArents_frequencies.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/frequencies/frequencies.edit.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				  function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
					
					$scope.editFrequency = function (frequency: any)  {
						if (frequency._id) {           
							$http.put(`${url}/${frequency._id}`, frequency).then((resp) => {
								if (resp.data['success']) {
									$state.go('main.frequencies.list');
								}
							});  
						} else {
							$http.post(`${url}`, frequency).then((resp) => {
								if (resp.data['success']) {
									$state.go('main.frequencies.list');
								}
							});
						}
					};
					  
					if ($stateParams.frequencyId) {
						$http.get(`${url}/${$stateParams.frequencyId}`).then((resp) => {
							$scope.frequency = resp.data['data'];
						});
					}
				}]
			});
	}
			
}
