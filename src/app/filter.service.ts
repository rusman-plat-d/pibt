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
    this.filterForm = fb.group({
      pid: [PERSONIL_PID],
      project: ['', ],
      product: ['',],
      additionTask: ['', ],
      module: ['', ],
      date_start: fb.group({
        start: [],
        end: [],
      }),
      date_target: fb.group({
        start: [],
        end: [],
      }),
      date_finish: fb.group({
        start: [],
        end: [],
      }),
      activity: ['', ],
      status: [[], ],
      effort: [['Small','Medium','Large','Extra Large'], ],
      blockers: ['', ],
      createdAt: [null, ],
      updatedAt: [null, ],
    });
  }
}
