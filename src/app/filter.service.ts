import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PERSONIL_PID } from './data/personil';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filterForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {
    const date = new Date();
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2,'0');
    const D = date.getDate().toString().padStart(2,'0');
    const MAX_DATE = {
      D: M == '02' && Y%4 == 0? '29' : '28',
    }
    const START_DATE = new Date(`${Y}-${M}`);
    const END_DATE = new Date(`${Y}-${M}-${MAX_DATE.D}`);
    
    this.filterForm = fb.group({
      pid: [PERSONIL_PID],
      project: ['', ],
      product: ['',],
      additionTask: ['', ],
      module: ['', ],
      date_start: fb.group({
        start: [START_DATE],
        end: [END_DATE],
      }),
      date_target: fb.group({
        start: [START_DATE],
        end: [END_DATE],
      }),
      date_finish: fb.group({
        start: [START_DATE],
        end: [END_DATE],
      }),
      activity: ['', ],
      // status: [['Off Track','On Track','At Risk','Completed'], ],
      status: [[], ], // value initialized at table.component.ts
      effort: [['Small','Medium','Large','Extra Large'], ],
      blockers: ['', ],
      createdAt: [null, ],
      updatedAt: [null, ],
    });
  }
}
