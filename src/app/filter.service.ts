import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filterForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {
    this.filterForm = fb.group({
      pid: [[]],
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
      status: ['', ],
      effort: ['', ],
      blockers: ['', ],
      createdAt: ['', ],
      updatedAt: ['', ],
    });
  }
}
