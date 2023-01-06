import { Component, OnInit, forwardRef, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'lodash';

import { v4 as uuid } from 'uuid';
import { FieldMapper } from '../model/field-mapper';

const DYNAMIC_FORM_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DynamicFormComponent),
  multi: true,
};

@Component({
  selector: 'opmr-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers : [DYNAMIC_FORM_CONTROL_ACCESSOR]
})
export class DynamicFormComponent implements ControlValueAccessor {

  formGroup! : FormGroup;
  @Input() fields : FieldMapper[] = [
    {
      name : 'someInput1',
      type : 'input'
    },
    {
      name : 'someInput2',
      type : 'input'
    }
  ];

  private onTouched!: Function;
  private onChanged!: Function;

  constructor(
    private fb: FormBuilder
  ) {}

  id = uuid();

  ngOnInit(): void {
    this.createFormGroup(this.fields);
  }

  ngOnChanges(changes : SimpleChanges) : void {
    if(!isEqual(changes['fields']?.previousValue, changes['fields'].currentValue)){
      this.createFormGroup(changes['fields'].currentValue);
    }
  }

  createFormGroup(fields : FieldMapper[]){
    this.formGroup = new FormGroup({});
    fields.forEach((field : FieldMapper)=>{
      this.formGroup.addControl(field.name, new FormControl([
        null
      ]))
    })
  }

  writeValue(value: any): void {
    if(value){
      this.formGroup.setValue(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  updateValueChange(event : any){
    this.onTouched();
    this.formGroup.get([event.controlName])?.patchValue(event.controlValue);
    this.onChanged(this.formGroup.value);
  }

}