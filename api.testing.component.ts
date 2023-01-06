import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { NavService } from '../../layouts/navbar/nav.service';
import { APIData, ApplicationNameData } from './api-testing.model';
import { APITestingService } from './api-testing.service';
// import {MatMenuModule} from '@angular/material/menu';


@Component({
  selector: 'opmr-api-testing',
  templateUrl: './api-testing.component.html',
  styleUrls: ['./api-testing.component.scss']
})
export class ApiTestingComponent implements OnInit {


  finalForm: FormControl = new FormControl();

  constructor(private router: Router, private apiTestingService: APITestingService, private navService: NavService) {
    this.navService.sendUpdate('load');
  }

  applicationName = new FormControl('');
  options: ApplicationNameData[] = [];
  filteredOptions!: Observable<ApplicationNameData[]>;

  selectedAPI = new FormControl('');
  apiList: APIData[] = [];
  filteredAPI!: Observable<APIData[]>;

  payloadData = new FormControl('');
  requestType: string = '';

  responseData: string = '';

  ngOnInit() {
    this.apiTestingService.getAppNames('https://jsonblob.com/api/1051411392296665088').subscribe(appNames => {
      this.options = appNames;
      this.filteredOptions = this.applicationName.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAppNames(value || '')),
      );
    })
  }

  private _filterAppNames(value: string): ApplicationNameData[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: ApplicationNameData) => {
      if (option.applicationName.toLowerCase().indexOf(filterValue) != -1) {
        return option;
      }
      return;
    });
  }

  private _filterAPIUrls(value: string): APIData[] {
    const filterValue = value.toLowerCase();
    return this.apiList.filter((option: APIData) => {
      if (option.apiName.toLowerCase().indexOf(filterValue) != -1) {
        return option;
      }
      return;
    });
  }

  onAppNameSelect() {
    this.filteredOptions.subscribe(options => {
      const currentAppName = options.find(x => x.applicationName == this.applicationName.value);
      // this.apiTestingService.postRequest('https://jsonblob.com/api/1051411392296665088', { 'code': currentAppName }).subscribe(urlList => {
      this.apiTestingService.getAppNames('https://jsonblob.com/api/1051420298867654656').subscribe(urlList => {
        this.apiList = urlList;
        this.filteredAPI = this.selectedAPI.valueChanges.pipe(
          startWith(''),
          map(value => this._filterAPIUrls(value || '')),
        );
        this.selectedAPI.patchValue('');
        this.payloadData.patchValue('');
        this.requestType = '';
        this.responseData = '';
      })
    })

  }

  onAPISelected() {
    this.filteredAPI.subscribe(apiList => {
      const currentAPI = apiList.find(x => x.apiName === this.selectedAPI.value);
      if (currentAPI) {
        this.payloadData.setValue(currentAPI?.requestParameters);
        this.requestType = currentAPI.requestType;
        this.responseData = '';
      }
    })
  }

  getResponse() {
    this.apiTestingService.getAppNames('https://jsonblob.com/api/1051420298867654656').subscribe(resp => {
      // this.apiTestingService.postRequest('',{payload : this.payloadData}).subscribe(resp=>{
      this.responseData = resp;
    })
  }
  checkData(){
    console.log(this.finalForm.value);
  }
}
