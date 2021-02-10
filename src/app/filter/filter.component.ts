import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { debounceTime, map, takeWhile } from 'rxjs/operators';
import { PERSONIL } from '../data/personil';
import { FilterService } from '../filter.service';
import { IPersonil } from '../types/personil';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements AfterViewInit, OnDestroy, OnInit {
  private _alive = true;
  nameFilterCtrl = new FormControl([19]);
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

  public tooltipMessage = 'Select All / Unselect All';
  @ViewChild('personalSelect', { static: true }) personalSelect: MatSelect | null = null;

  constructor(
    public filterService: FilterService,
    public dialogRef: MatDialogRef<FilterComponent>,
  ) { }

  ngAfterViewInit(){
    setTimeout(() => {
      this.nameFilterCtrl.setValue([]);
    }, 1);
  }

  ngOnDestroy () {
		this._alive = false;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close();
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredBanksMulti
    .pipe(
      take(1),
      takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.bankMultiCtrl.patchValue(val);
        } else {
          this.bankMultiCtrl.patchValue([]);
        }
      });
  }
}
