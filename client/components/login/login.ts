import '../helper/helper';
import '../auth/auth.service';
import {LogIn} from '../../core/dto.ts';

namespace Login {
	/** @ngInject */
	function config($stateProvider: any) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'components/login/login.html',
				controller: 'LoginController',
				controllerAs: 'liCtrl'
			});
	}

	export class LoginController {
		

		private loginDetails: any;
		private loginError: boolean;
		private errorMessage: string;
		/** @ngInject */
		constructor(private $LoginRESTService: any, private $cookies: any, 
			private $SignUpRESTService: any, private AuthToken: any, private $state: any) {
			
		};
		
		login() {
			this.$LoginRESTService.accountLogin(this.loginDetails).then((response: any) => {
				
				this.loginError = !response.success;
				this.errorMessage = response.msg;
				if (response.success) {
					this.AuthToken.setToken(response.data.token);
					const urlInvParam = this.AuthToken.getInvitationUrlParam();
					this.$state.transitionTo('main', urlInvParam);
				}
			});
		}
	};
	angular
		.module('app.login', [
			'ui.router',
			'app.signup',
			'app.helper',
			'app.auth',
			'ngCookies'
		])
		.config(config)
		.controller('LoginController', LoginController);
}
