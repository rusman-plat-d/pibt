import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, takeWhile } from 'rxjs/operators';
import { PERSONIL } from '../data/personil';
import { FilterService } from '../filter.service';
import { IPersonil } from '../types/personil';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy, OnInit {
  private _alive = true;
  nameFilterCtrl = new FormControl(' ');
  personil: IPersonil[] = PERSONIL;
  personilTrackByFn = (index: number, personil: IPersonil) => {
    return personil.pid;
  } 
  personil$ = this.nameFilterCtrl.valueChanges
      .pipe(
        takeWhile(()=>this._alive),
        debounceTime(333),
        map((q: string)=>{
          q = q.toLowerCase();
          if (q == '') {
            return this.personil;
          }
          let retVal = this.personil.filter((personil, index) =>{
            return personil.nama.toLowerCase().indexOf(q) > -1
                || personil.panggilan.toLowerCase().indexOf(q) > -1;
          });
          return retVal;
        })
      );
  constructor(
    public filterService: FilterService
  ) { }

  ngOnDestroy () {
		this._alive = false;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    
  }
}
