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

import firebase from 'firebase/app';

import { IPersonil } from '../types/personil';
import { PERSONIL } from '../data/personil';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Backlog } from '../types/backlog';

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
    @Inject(MAT_DIALOG_DATA) public dialogData: {id:string}
  ) {}

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
    console.log(this.dialogData);
    if (this.dialogData.id) {
      this._afs.doc('backlog/'+this.dialogData.id)
        .get()
        .pipe(
          takeWhile(()=>this._alive)
        )
        .subscribe(doc=>{
          const data = doc.data() as Backlog;
          console.log(82, doc.data());
          this.formGroup.setValue({
            ...(data),
            date_start:  (data?.date_start && (data?.date_start as any)?.toDate()) ?? '',
            date_target: (data?.date_start && (data?.date_target as any)?.toDate()) ?? '',
            date_finish: (data?.date_start && (data?.date_finish as any)?.toDate()) ?? '',
            id: doc.id,
          });
        });
    }
  }

  buildForm() {
    this.formGroup = this._fb.group({
      id: ['', ],
      pid: ['', Validators.required],
      project: ['', Validators.required],
      product: ['',],
      additionTask: ['', ],
      module: ['', Validators.required],
      date_start: [new Date, ],
      date_target: [new Date, ],
      date_finish: [new Date, ],
      activity: ['', Validators.required],
      status: ['On Track', Validators.required],
      effort: ['Small', Validators.required],
      blockers: ['', ],
      createdAt: ['', ],
      updatedAt: ['', ],
    });
  }

  onSubmit(){
    if (this.formGroup.valid) {
      const doc = this.formGroup.value as Backlog;
      if (!doc.createdAt) {
        doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      }
      doc.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      // add
      if (doc.id == '') {
        const id = this._afs.createId();
        doc.id = id;
        this._afs.doc('backlog/'+id).set(doc);
        this.buildForm();
        this.submit.next(this.closeAfterSubmit);
      } else{ // edit to update
        this._afs.doc('backlog/'+doc.id).update(doc);
        this.submit.next(true);
      }
    }
  }
}