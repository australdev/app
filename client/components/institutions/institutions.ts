namespace institutions {

	angular.module('app.institutions', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/institution';
					
		$stateProvider
			.state('main.institutions', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/institutions' onto the urls of all its children.
				url: '/institutions', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/institutions/institutions.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Institution';
					}
				]
			})
			
			/////////////////////
			//  > Institutions > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'institutions' state.
			.state('main.institutions.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/institutions' (because '/institutions' + '').
				url: '',
		
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within institutions.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/institutions/institutions.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.deleteInstitution = function (data: any)  {
								let result: boolean = confirm('Are you sure? All the information related to this institution will be lost!');
								if (result) {
									$http.delete(`${url}/${data.id}`).then((resp) => {
										if (resp.data['success']) {
											$state.go($state.current, {}, {reload: true});
										}
									});
								} 
							};
							
							$http.get(`${url}/_find`).then((resp) => {
								$scope.institutions = resp.data['data'];
							});
						}]
					}
				}
			})
      
			/////////////////////
			//  > Institutionss > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'institutions' state.
			  .state('main.institutions.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/institutions' (because '/institutions' + '').
				url: '/:institutionId',
		  
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within _pArents_institutions.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/institutions/institutions.edit.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				  function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {

					$scope.editInstitution = function (institution: any)  {	
						if (institution._id) {           
							$http.put(`${url}/${institution._id}`, institution).then((resp) => {
								if (resp.data['success']) {
									$state.go('main.institutions.list');
								}
							});  
					  	} else {
							$http.post(`${url}`, institution).then((resp) => {
								if (resp.data['success']) {
									$state.go('main.institutions.list');
								}
							});
					  	}
					};
					  
					if ($stateParams.institutionId) {
						$http.get(`${url}/${$stateParams.institutionId}`).then((resp) => {
							$scope.institution = resp.data['data'];
						});
					}
				}]
			});
	}
			
}
