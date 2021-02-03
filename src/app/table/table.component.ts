import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTable } from '@angular/material/table';

export interface Log {
  name: string;
  project: string;
  product: string;
  additionTask: string;
  module: string;
  date_start: string | Date;
  date_target: string | Date;
  date_finish: string | Date;
  activity: string;
  status: string;
  effort: string;
  blockers: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy, OnInit {
  dataSource: Log[] = [];
  displayedColumns = [
    'name',
    'project',
    'product',
    'additionTask',
    'module',
    'date_start',
    'date_target',
    'date_finish',
    'activity',
    'status', // Completed | On Track | At Risk | Off Track
    'effort', // Small | Medium | Large | Extra Large
    'blockers',
  ];

  constructor(
    public afs: AngularFirestore
  ) { }

  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }

}
