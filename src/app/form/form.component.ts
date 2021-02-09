import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, switchMap, takeWhile } from 'rxjs/operators';

interface IPersonil {
  pid: number;
  nama: string;
  panggilan: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements AfterViewChecked, AfterViewInit, OnDestroy, OnInit {
  private _alive = true;
  formGroup!: FormGroup;
  nameFilterCtrl = new FormControl('');
  personil: IPersonil[] = [
    { pid: 1,   nama:'INDRIYANTO',                  panggilan:'Kim' },
    { pid: 2,   nama:'NURIANA SANTIARA',            panggilan:'Nur' },
    { pid: 3,   nama:'YUSUP SUPRIATNA',             panggilan:'Ucup' },
    { pid: 4,   nama:'STEFANUS CHRISTIAN CAHYONO',  panggilan:'Stef' },
    { pid: 5,   nama:'KALAM HADA PRATAMA',          panggilan:'Kalam' },
    { pid: 6,   nama:'MOCHAMAD FAJAR SUADA',        panggilan:'Bang Alex' },
    { pid: 8,   nama:'ABDUL WAHID',                 panggilan:'Wahid' },
    { pid: 9,   nama:'ASEP NASIHIN',                panggilan:'Kumis / Kolot' },
    { pid: 10,  nama:'DESTA AHMAD PAHLEVI',         panggilan:'Desta' },
    { pid: 11,  nama:'ARFAN CITRA WIBOWO',          panggilan:'Arfan' },
    { pid: 12,  nama:'ANGGARA PRATAMA PUTRA',       panggilan:'Code Racer' },
    { pid: 13,  nama:'HADI HADIANSYAH',             panggilan:'Mang Hadi' },
    { pid: 14,  nama:'MUHAMMAD ADAM DZULQARNAIN',   panggilan:'Adam' },
    { pid: 15,  nama:'SANDI SURYADI',               panggilan:'Isur' },
    { pid: 16,  nama:'SANDI MULYADI',               panggilan:'Emul' },
    { pid: 17,  nama:'ABDUL HADI',                  panggilan:'Si Dul' },
    { pid: 19,  nama:'RUSMAN WAHAB',                panggilan:'Rusman' },
    { pid: 20,  nama:'MUHAMAD FAHMI SECHAN',        panggilan:'Sechan' },
    { pid: 21,  nama:'M. ANDRIAWAN RIDWAN',         panggilan:'Andri / wawan' },
    { pid: 22,  nama:'SATRIO',                      panggilan:'Tio' },
    { pid: 23,  nama:'KANG IMAT',                   panggilan:'Kang imat' },
  ];
  personilTrackByFn = (index: number, personil: IPersonil) => {
    return personil.pid;
  }
  personil$ = this.nameFilterCtrl.valueChanges
      .pipe(
        takeWhile(()=>this._alive),
        debounceTime(333),
        map((q: string)=>{
          console.clear();
          q = q.toLowerCase();
          console.log(43,q,'43');
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
    private _fb: FormBuilder
  ) {
  }

  ngAfterViewChecked(){
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.nameFilterCtrl.setValue(' ');
      this.nameFilterCtrl.setValue('');
    }, 1);
  }

  ngOnDestroy () {
		this._alive = false;
  }
  
  ngOnInit(): void {
    this.formGroup = this._fb.group({
      name: ['', Validators.required],
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
      blockers: ['', Validators.required],
    });
  }

  onSubmit(e: any){
    console.log(e, this.formGroup.value);
  }
}