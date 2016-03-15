import '../login/login';
import {BACK_END_ROUTE, SignUp} from '../../core/dto';


namespace SignUpServices {

	
	/** @ngInject */
    function $SignUpRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let url = "/api/signup";
		
		let resources: angular.resource.IResourceClass<any> = $resource(url, {}, {

			'getSchools': {
				method: 'GET',
				url: BACK_END_ROUTE + '/school/_find'
			},
			'getClient': {
				method: 'GET',
				url: BACK_END_ROUTE + '/client/_find',
			},
			'getFrequency': {
				method: 'GET',
				url: BACK_END_ROUTE + '/frequency/_find'
			},
			'getPaymentType': {
				method: 'GET',
				url: BACK_END_ROUTE + '/payment-type/_find'	
			},
			'isUserRegistered': {
				method: 'GET',
				url: BACK_END_ROUTE + '/user/_exist'
			},
			'signUp': {
				method: 'POST',
				url: BACK_END_ROUTE + '/signup'
			}

		});

		return resources;
	};


	export class $SignUpRESTService {
		constructor(private $http: angular.IHttpService, private $SignUpRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		getSchools = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getSchools', params);
		};
		getClients = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getClients', params);
		};
		getPaymentTypes = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getPaymentTypes', params);
		};
		getFrequencies = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getFrequencies', params );
		};
		isUsernameAssigned = (username: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'isUserRegistered', {userName: username});
		};
		isEmailAssigned = (email: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'isUserRegistered', {email: email});
		};
		signUp = (signUpDetails: SignUp) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'signUp', signUpDetails);
		};

	};

	function get$SignUpRESTServiceInstance($http: angular.IHttpService, $SignUpRESTResource: any, $q: any, $resourceHelper: any) {
        return new $SignUpRESTService($http, $SignUpRESTResource, $q, $resourceHelper);
    }

	angular
		.module('app.signup')
		.factory('$SignUpRESTResource', $SignUpRESTResource)
		.factory('$SignUpRESTService', get$SignUpRESTServiceInstance);
}
