
import '../helper/helper';
import {SignUp, User} from '../../core/dto.ts';

namespace SignUp {

	/* @ngInject */
	function config($stateProvider: any) {
		$stateProvider
			.state('signup', {
				url: '/signup',
				templateUrl: 'components/signup/signup.html',
				controller: 'SignUpController',
				controllerAs: 'suCtrl'
			});
	}

	export class SignUpController {

		usernameChanged = () => {
			this.checkingUsername = true;
			this.availableUsername = undefined;
			if (this.user.userName !== undefined && this.user.userName.trim() !== '') {
				this.$SignUpRESTService.isUsernameAssigned(this.user.userName).then((response: any) => {
					this.checkingUsername = false;
					this.availableUsername = !response.data.exist;
				});
			}
		};

		emailChanged = () => {
			this.checkingEmail = true;
			this.availableEmail = undefined;
			if (this.user.email !== undefined && this.user.email.trim() !== '') {
				this.$SignUpRESTService.isEmailAssigned(this.user.email).then((response: any) => {
					this.checkingEmail = false;
					this.availableEmail = !response.data.exist;
				});
			}
		};

		mapFormToDto = (details: User): SignUp => {
			let result: SignUp = <SignUp>{};
			result = {
				user: details
			};
			return result;
		};
		
		private user: User;
		private errors: Array<string> = [];
		private passwordConfirmation: string;
		private availableUsername: boolean;
		private availableEmail: boolean;
		private checkingUsername: boolean;
		private checkingEmail: boolean;
		
		
		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService, private $log: angular.ILogService,
			private $SignUpRESTService: any) {
		};


		submitFinalSep(finalStepForm: any) {
			this.$log.info('signup details ', this.user);
			
			this.errors = [];
			if (this.user.password !== this.passwordConfirmation) {
				this.errors.push('Passwords does not match');
			}

			if (!this.availableEmail) {
				this.errors.push('Email is not available');
			}
			
			if (!this.availableUsername) {
				this.errors.push('Username is not available');
			}
			
			// Format user data to signUp data
			this.$SignUpRESTService.signUp(this.mapFormToDto(this.user)).then(function(response: any) {
				console.log('success:', response);
				alert('Successfully sign up');

			}, function(error: any) {
				console.log('error', error);
			});

		};

	};
	angular.module('app.signup', [
		'ui.router',
		'ngResource',
		'app.helper'
	])
		.config(config)
		.controller('SignUpController', SignUpController);
}
