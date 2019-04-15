/**
 * Created By : Sangwin Gawande (http://sangw.in)
 */
 import { Component, OnInit } from '@angular/core';
 import {Validators, FormBuilder, FormGroup} from '@angular/forms';
 import { RouterModule, Routes ,Router,ActivatedRoute} from '@angular/router';

 // Services
 import { ValidationService } from '../../../services/config/config.service';
 import { employeeService } from '../../../services/employee/employee.service';
 import { routerTransition } from '../../../services/config/config.service';
 
 import { ToastrService } from 'ngx-toastr';

 @Component({
 	selector: 'app-employee-add',
 	templateUrl: './employee-add.component.html',
 	styleUrls: ['./employee-add.component.css'],
 	animations: [routerTransition()],
 	host: {'[@routerTransition]': ''}
 })

 export class employeeAddComponent implements OnInit {
 	// create employeeAddForm of type FormGroup 
 	private employeeAddForm : FormGroup;
 	index:any;

 	constructor(private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute, private employeeService:employeeService,private toastr: ToastrService) { 

 		// Check for route params
 		this.route.params.subscribe(params => {
 			this.index = params['id'];
 			// check if ID exists in route & call update or add methods accordingly
 			if (this.index && this.index != null && this.index != undefined) {
 				this.getemployeeDetails(this.index);
 			}else{
 				this.createForm(null);
 			}
 		});
 	}

 	ngOnInit() {
 	}

 	// Submit employee details form
 	doRegister(){
 		if (this.index && this.index != null && this.index != undefined) {
 			this.employeeAddForm.value.id = this.index
 		}else{
 			this.index = null;
 		}
 		let employeeRegister = this.employeeService.doRegisteremployee(this.employeeAddForm.value, this.index);
 		if(employeeRegister) {
 			if (employeeRegister.code == 200) {
 				this.toastr.success(employeeRegister.message,"Success");
 				this.router.navigate(['/']);
 			}else{
 				this.toastr.error(employeeRegister.message,"Failed");
 			}
 		}
 	}

 	// If this is update form, get user details and update form
 	getemployeeDetails(index:number){
 		let employeeDetail = this.employeeService.getemployeeDetails(index);
 		this.createForm(employeeDetail);
 	}

 	// If this is update request then auto fill form
 	createForm(data){
 		if (data == null) {
 			this.employeeAddForm = this.formBuilder.group({
 				first_name: ['',  [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
 				last_name: ['',  [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
 				phone: ['',  [Validators.required,ValidationService.checkLimit(5000000000,9999999999)]],
 				email: ['',  [Validators.required, ValidationService.emailValidator]]
 			});			
 		}else{
 			this.employeeAddForm = this.formBuilder.group({
 				first_name: [data.employeeData.first_name,  [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
 				last_name: [data.employeeData.last_name,  [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
 				phone: [data.employeeData.phone,  [Validators.required,ValidationService.checkLimit(5000000000,9999999999)]],
 				email: [data.employeeData.email,  [Validators.required, ValidationService.emailValidator]]
 			});
 		}
 	}

 }

/**
 * Created By : Sangwin Gawande (http://sangw.in)
 */