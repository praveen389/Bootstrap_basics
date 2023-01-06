import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FieldMapper } from '../../model/field-mapper';


@Component({
  selector: 'opmr-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor() { }
  field! : FieldMapper;
  @Output() updateValueChange = new EventEmitter();
  inputControl : FormControl = new FormControl('');

  ngOnInit(): void {
    this.inputControl.valueChanges.pipe(debounceTime(400)).subscribe(value=>{
      this.updateValueChange.emit({controlName : this.field.name, controlValue : value});
    })
  }

}