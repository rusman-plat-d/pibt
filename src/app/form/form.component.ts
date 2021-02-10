import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, switchMap, takeWhile } from 'rxjs/operators';

import firebase from 'firebase';

import { IPersonil } from '../types/personil';
import { PERSONIL } from '../data/personil';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements AfterViewChecked, AfterViewInit, OnDestroy, OnInit {
  private _alive = true;
  closeAfterSubmit = true;
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
          return retVal;
        })
      );
  showCloseCheckbox = true;
  @Output() submit = new EventEmitter<boolean>();
  constructor(
    private _fb: FormBuilder,
    private _afs: AngularFirestore,
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {showCloseCheckbox:boolean}
  ) {
    this.showCloseCheckbox = dialogData.showCloseCheckbox;
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
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this._fb.group({
      id: ['', ],
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
      createdAt: ['', ],
      updatedAt: ['', ],
    });
  }

  onSubmit(){
    if (this.formGroup.valid) {
      const doc = this.formGroup.value;
      if (!doc.createdAt) {
        doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      }
      doc.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      // add
      if (doc.id == '') {
        this._afs.collection('backlog').add(doc);
        this.buildForm();
        this.submit.next(this.closeAfterSubmit);
      } else{ // edit to update
        this._afs.doc('backlog/'+doc.id).update(doc);
        this.submit.next(true);
      }
    }
  }
}