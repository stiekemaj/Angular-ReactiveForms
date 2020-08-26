import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // root formGroup
  customerForm: FormGroup;
  firstNameControl = new FormControl();
  lastNameControl = new FormControl();
  emailControl = new FormControl();

  customer = new Customer();

  constructor() { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl,
      sendCatalog: new FormControl(true)
    });
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
