import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {Customer} from './customer';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // root formGroup
  customerForm: FormGroup;
  customer = new Customer();

  validationMessages = {
    required: 'Please enter a value',
    email: 'Please enter a valid email address'
  };


  controlMessages = {
    email: ''
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['']
      }, {
        validators: this.emailMatcher
      }),
      phone: '',
      notification: 'email',
      rating: ['', [this.range(1, 5), Validators.required]],
      sendCatalog: true,
      addresses: this.fb.array([this.createAddress()])
    });

    this.customerForm.get('notification').valueChanges
      .subscribe(value => this.notificationValueChanged(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(_ => {
      this.initMessage(emailControl, 'email');
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      addressType: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  getAddresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    this.getAddresses().push(this.createAddress());
  }

  initMessage(c: AbstractControl, controllerName): void {
    this.controlMessages[controllerName] = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.controlMessages[controllerName] = Object.keys(c.errors)
        .map(key => this.validationMessages[key])
        .join(' ');
    }
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  notificationValueChanged(value): void {
    const phoneControl = this.customerForm.get('phone');
    switch (value) {
      case 'email':
        phoneControl.clearValidators();
        break;
      case 'text':
        phoneControl.setValidators([Validators.required]);
        break;
    }
    phoneControl.updateValueAndValidity();
  }

  range(min: number, max: number): ValidatorFn {
    return (c: AbstractControl) => {
      if (c.value != null && (isNaN(c.value) || c.value < min || c.value > max)) {
        return {range: true};
      } else {
        return null;
      }
    };
  }

  emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
    const email = c.get('email');
    const confirmEmail = c.get('confirmEmail');

    if (email.pristine || confirmEmail.pristine) {
      return null;
    }

    if (email.value === confirmEmail.value) {
      return null;
    }
    return {match: true};
  }
}
