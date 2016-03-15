import './login';
import {BACK_END_ROUTE, LogIn} from '../../core/dto';

namespace LoginServices {

	function $LoginRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			'accountLogin': {
				method: 'POST',
				url: BACK_END_ROUTE + '/login'
			}
		});
		return resources;
	}

	export class $LoginRESTService {
		constructor(private $http: angular.IHttpService, private $LoginRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		accountLogin = (login: LogIn) => {
			return this.$resourceHelper.resourceRESTCall(this.$LoginRESTResource, 'accountLogin', login, true);
		};
	}
	
	function get$LoginRESTServiceInstance($http: angular.IHttpService, $LoginRESTResource: any, $q: any, $resourceHelper: any) {
        return new $LoginRESTService($http, $LoginRESTResource, $q, $resourceHelper);
    }
	angular
		.module('app.login')
		.factory('$LoginRESTResource', $LoginRESTResource)
		.factory('$LoginRESTService', get$LoginRESTServiceInstance);
}