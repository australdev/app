namespace courseTypes {

	angular.module('app.courseTypes', [
		'ui.router'
	])
	.config(config);
	
	/* @ngInject */
	function config($stateProvider: any) {
		
		const url = '/api/course-type';
					
		$stateProvider
			.state('main.courseTypes', {
				// With abstract set to true, that means this state can not be explicitly activated.
				// It can only be implicitly activated by activating one of its children.
				abstract: true,
				// This abstract state will prepend '/courseTypes' onto the urls of all its children.
				url: '/course-type', 
				// Example of loading a template from a file. This is also a top level state,
				// so this template file will be loaded and then inserted into the ui-view
				// within index.html.
				templateUrl: 'components/course_types/course_types.html',
				controller: ['$scope', '$state', '$stateParams', '$http',
					function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
						$scope.texts = {};
						$scope.texts.title = 'Course Type';
					}
				]
			})
			
			/////////////////////
			//  > CourseTypes > List //
			/////////////////////
		
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'courseTypes' state.
			.state('main.courseTypes.list', {
		
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/courseTypes' (because '/courseTypes' + '').
				url: '',
		
				views: {
					// So this one is targeting the unnamed view within the parent state's template.
					'': {
						// IMPORTANT: Now we have a state that is not a top level state. Its
						// template will be inserted into the ui-view within this state's
						// parent's template; so the ui-view within courseTypes.html. This is the
						// most important thing to remember about templates.
						templateUrl: 'components/course_types/course_types.list.html',
						
						// You can pair a controller to your template. There *must* be a template to pair with.
						controller: ['$scope', '$state', '$stateParams', '$http',
						function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
							
							$scope.deleteCourseType = function (data: any)  {
								let result: boolean = confirm('Are you sure?');
								if (result) {
									$http.delete(`${url}/${data._id}`).then((resp) => {
										if (resp.data['success']) {
											$state.go($state.current, {}, {reload: true});
										}
									});
								} 
							};
							
							$http.get(`${url}/_find`).then((resp) => {
								$scope.courseTypes = resp.data['data'];
							});
						}]
					}
				}
			})
      
			/////////////////////
			//  > CourseTypess > Add/Modify //
			/////////////////////
		  
			// Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'courseTypes' state.
			  .state('main.courseTypes.edit', {
				
				// Using an empty url means that this child state will become active
				// when its parent's url is navigated to. Urls of child states are
				// automatically appended to the urls of their parent. So this state's
				// url is '/courseTypes' (because '/courseTypes' + '').
				url: '/:courseTypeId',
		  
				// IMPORTANT: Now we have a state that is not a top level state. Its
				// template will be inserted into the ui-view within this state's
				// parent's template; so the ui-view within _pArents_courseTypes.html. This is the
				// most important thing to remember about templates.
				templateUrl: 'components/course_types/course_types.edit.html',
				
				// You can pair a controller to your template. There *must* be a template to pair with.
				controller: ['$scope', '$state', '$stateParams', '$http',
				  function($scope: any, $state: any, $stateParams: any, $http: angular.IHttpService) {
				
					$scope.editCourseType = function (courseType: any)  {	  
					  if (courseType._id) {           
						$http.put(`${url}/${courseType._id}`, courseType).then((resp) => {
						  if (resp.data['success']) {
							$state.go('main.courseTypes.list');
						  }
						});  
					  } else {
						$http.post(`${url}`, courseType).then((resp) => {
						  if (resp.data['success']) {
							$state.go('main.courseTypes.list');
						  }
						});
					  }
					};
					  
					if ($stateParams.courseTypeId) {
						$http.get(`${url}/${$stateParams.courseTypeId}`).then((resp) => {
							$scope.courseType = resp.data['data'];
						});
					}
					
				}]
			});
	}
			
}
