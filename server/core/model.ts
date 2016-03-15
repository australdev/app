import {Schema, Document, createConnection} from 'mongoose';
import * as bcrypt from 'bcrypt';

import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';

/* tslint:disable */
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */
const SALT = 10;

const db = createConnection(process.env.AUSTRAL_MONGO_URI);
db.on('error', () => console.error('Error connecting to Database:', process.env.AUSTRAL_MONGO_URI));
db.once('open', () => console.log('%s: Connected to MongoDb on %s', new Date(), process.env.AUSTRAL_MONGO_URI));


const schemas = {
  	user: new Schema({
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		userName: { type: String, required: true },
		locale: { type: String },
		picture: { type: String },
		countryCode: { type: String },
		timezone: { type: Number },
		gender: { type: String },
		verified: { type: Number },
		status: { type: Number, default: 1, index: true, required: true },
		lastLoginDate: { type: Date },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
		deletedAt: { type: Number }
	}),
	coe: new Schema({
		student: { type: ObjectId, ref: 'student', required: true, index: true },
		institution: { type: ObjectId, ref: 'institution', required: true, index: true },
		courseType: { type: ObjectId, ref: 'courseType', required: true, index: true },
		courseCode: { type: String },
		courseName: { type: String, required: true },
		startDate: { type: Date, default: new Date(), required: true },
		endDate: { type: Date, default: new Date(), required: true },
		tuitionFee: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
		deletedAt: { type: Number }
	}),
  	frequency: new Schema({
		code: { type: String, required: true },
		description: { type: String, required: true },
		periodicity: { type: Number, required: true },
		minPeriod: { type: ObjectId, ref: 'periodicity', required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
		deletedAt: { type: Number }
	}),
	student: new Schema({
		institutionCode: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	payment: new Schema({
		studyPeriod: { type: ObjectId, ref: 'studyPeriod', required: true, index: true },
		paymentType: { type: ObjectId, ref: 'paymentType', required: true, index: true },
		description: { type: String },
		expectedDate: { type: Date, default: new Date(), required: true },
		expectedValue: { type: Number, required: true },
		commPerc: { type: Number, required: true },
		paymentGts: { type: Number, required: true },
		frequency: { type: String },
		coursePayment: { type: Number, required: true },
		expectedComm: { type: Number, required: true },
		receivedDate: { type: Date, default: new Date() },
		receivedValue: { type: Number },
		invoice: { type: Number },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	institution: new Schema({
		name: { type: String, required: true },
		code: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	paymentType: new Schema({
		code: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	studyPeriod: new Schema({
		coe: { type: ObjectId, ref: 'coe', required: true, index: true },
		description: { type: String },
		startDate: { type: Date, default: new Date() },
		endDate: { type: Date, default: new Date() },
		periodFee: { type: Number, required: true },
		commPerc: { type: Number, required: true },
		expectedComm: { type: Number, required: true },
		periodGts: { type: Number, required: true },
		frequency: { type: ObjectId, ref: 'frequency', required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	courseType: new Schema({
		code: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	}),
	periodicity: new Schema({
		code: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		createdBy: { type: ObjectId, ref: 'user' },
		createdAt: { type: Number },
		updatedAt: { type: Number },
	    deletedAt: { type: Number }
	})
};


for (let prop in schemas) {
  const schem: Schema = schemas[prop];
  schem.pre('save', function(next: Function) {
    const obj: Document = this;
    const now = new Date();
    if (obj.isNew) {
      obj['createdAt'] = now;
    }
    obj['updatedAt'] = now;
    next();
  });
}


export const UserModel = db.model('user', schemas.user);
export const CoeModel = db.model('coe', schemas.coe);
export const FrequencyModel = db.model('frequency', schemas.frequency);
export const StudentModel = db.model('student', schemas.student);
export const PaymentModel = db.model('payment', schemas.payment);
export const InstitutionModel = db.model('institution', schemas.institution);
export const PaymentTypeModel = db.model('paymentType', schemas.paymentType);
export const StudyPeriodModel = db.model('studyPeriod', schemas.studyPeriod);
export const CourseTypeModel = db.model('courseType', schemas.courseType);
export const PeriodicityModel = db.model('periodicity', schemas.periodicity);


schemas.user.pre('save', function (next: Function) {
  const obj = this;
  if (!obj.isModified('password')) {
    next();
  }
 
  bcrypt.hash(obj['password'], SALT, (err, hash) => {
      if (err) { 
        next(err);
      };
      
      obj['password'] = hash;
      next();
  });  
});