export const BACK_END_ROUTE = '/api';

export interface BaseDto {
  _id?: any;
  createdBy?: any;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
}

export interface Notification {
  type: string;
  data?: any;
}

export interface AuthorizationEvaluationResponse {
  authorized: boolean;
  msg?: string;
}

export interface AuthorizationData {
  user?: User;
}

export interface SignUp extends BaseDto {
  user?: User;
}

export interface LogIn extends BaseDto {
  username?: string;
  password?: string;
}


export interface User extends BaseDto {
  email?: string;
  password?: string;
  name?: string;
  userName?: string;
  locale?: string;
  picture?: string;
  countryCode?: string; 
  timezone?: number;
  gender?: string; 
  verified?: number; 
  status?: number;
  lastLoginDate?: Date; 
}

export interface AuthenticationResponse {
  token?: any;
  init?: any;
}

export interface ModelOptions {
  additionalData?: any;
  complexSearch?: any;
  population?: any;
  projection?: any;
  regularExpresion?: boolean;
  distinct?: any;
  authorization?: AuthorizationData;
  requireAuthorization?: boolean;
  copyAuthorizationData?: string;
  onlyValidateParentAuthorization?: boolean;
  validatePostSearchAuthData?: boolean;
  sort?: string;
}

export interface Coe extends BaseDto {

  student?: any;
  institution?: any;
  courseCode?: string;
  courseName?: string;
  startDate?: Date;
  endDate?: Date;
  tuitionFee?: string;

}

export interface Frequency extends BaseDto {

  code?: string;
  description?: string;
  periodicity?: string;
  minPeriod?: string;

}

export interface Student extends BaseDto {

  institutionCode?: string;
  name?: string;
  email?: string;

}

export interface Institution extends BaseDto {

  name?: string;
  code?: string;

}

export interface PaymentType extends BaseDto {

  code?: string;
  name?: string;
  description?: string;

}

export interface Payment extends BaseDto {

  studyPeriod: any;
  paymentType?: any;
  description?: string;
  coursePayment?: number;
  expectedDate?: Date;
  expectedValue?: number;
  commPerc?: number;
  paymentGts?: number;
  receivedDate?: Date;
  receivedValue?: number;
  frequency?: string;
  expectedComm?: number;
  invoice?: number;

}

export interface StudyPeriod extends BaseDto {

  coe?: any;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  periodFee?: string;
  commPerc?: string;
  periodGts?: number;
  frequency?: any;
  expectedComm?: number;
  expectedAmount?: number;
  receivedAmount?: number;
  remainingAmount?: number;

}

export interface CourseType extends BaseDto {

  code?: string;
  name?: string;
  description?: string;

}

export interface PaymentSearch extends BaseDto {

  student?: Student;
  institution?: Institution;
  payment?: Payment;
  startDate?: Date;
  endDate?: Date;

}

export interface Balance extends BaseDto {

  coe?: Coe;
  expectedCommission?: number;
  expectedGts?: number;
  expectedAmount?: number;
  receivedAmount?: number;
  remainingAmount?: number;

}

export interface BalanceSearch extends BaseDto {

  student?: Student;
  institution?: Institution;
  payment?: Payment;
  coe?: Coe;
  studyPeriod?: StudyPeriod;

}

export interface Periodicity extends BaseDto {

  code?: string;
  name?: string;
  description?: string;

}

export interface AuthorizationResponse {
  isAuthorized: boolean;
  errorMessage?: string;
}

export interface SocketNotification extends BaseDto {
  from?: string | User;
  message?: string;
  parentsData?: any;
  data?: any;
}

export interface FilterResponse extends BaseDto {
  wereThereFilters: boolean;
  distinctArray?: string[];
}

export interface CoeFilter extends BaseDto {
  student?: Student;
  institution?: Institution;
  coe?: Coe;
}
