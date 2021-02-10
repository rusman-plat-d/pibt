import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, switchMap, takeWhile } from 'rxjs/operators';

import { IPersonil } from '../types/personil';
import { PERSONIL } from '../data/personil';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements AfterViewChecked, AfterViewInit, OnDestroy, OnInit {
  private _alive = true;
  formGroup!: FormGroup;
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
          console.log(47, retVal);
          return retVal;
        })
      );
  constructor(
    private _fb: FormBuilder,
    private _afs: AngularFirestore,
  ) {
  }

  ngAfterViewChecked(){
  }

  ngAfterViewInit(){
    setTimeout(() => {
      // this.nameFilterCtrl.setValue(' ');
      this.nameFilterCtrl.setValue('');
    }, 1);
  }

  ngOnDestroy () {
		this._alive = false;
  }
  
  ngOnInit(): void {
    this.formGroup = this._fb.group({
      pid: ['', Validators.required],
      project: ['', Validators.required],
      product: ['',],
      additionTask: ['', ],
      module: ['', Validators.required],
      date_start: ['', ],
      date_target: ['', ],
      date_finish: ['', ],
      activity: ['', Validators.required],
      status: ['', Validators.required],
      effort: ['', Validators.required],
      blockers: ['', ],
    });
  }

  onSubmit(){
    const doc = this.formGroup.value;
    this._afs.collection('backlog').add(doc);
  }
}