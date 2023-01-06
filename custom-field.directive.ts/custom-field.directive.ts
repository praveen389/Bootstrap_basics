import { ComponentRef, Directive, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { InputComponent } from '../dynamic-input-types/input/input.component';
import { FieldMapper } from '../model/field-mapper';


export interface EmitField {
  controlName : string;
  controlValue : any;
}

@Directive({
  selector: '[opmrDynamicField]'
})
export class CustomFieldDirective implements OnInit{

  @Input() field! : FieldMapper;
  @Output() updateValueChange = new EventEmitter();
  componentInstance!: ComponentRef<any>;
  constructor( 
    public viewContainerRef: ViewContainerRef
  ) { }
  
  componentMapper: { [key: string]: any } = {
    input : InputComponent
  }

  ngOnInit(){
    this.componentInstance = this.viewContainerRef.createComponent(
      this.componentMapper[this.field.type]
    );
      this.componentInstance.instance.field = this.field;
      this.componentInstance.instance.updateValueChange.subscribe((res: EmitField) => {
        this.updateValueChange.emit(res);
      })
  }

  ngOnDestroy(){
    this.componentInstance.destroy();
    this.viewContainerRef.clear();
  }

}