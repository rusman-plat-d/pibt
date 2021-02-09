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
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormBuilder, FormGroup } from "@angular/forms";

import { Subscription } from "rxjs";
import { takeWhile } from "rxjs/operators";
import { FormComponent } from '../form/form.component';

export interface Log {
  id: string;
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
	private _alive = true;
	private _filterFormSubscription?: Subscription;
	dataSource = new MatTableDataSource<Log>();
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
	filterForm?: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
	@ViewChild(MatSort) sort: MatSort | null = null;

  search = false;
  trackBy = (row: Log) => {
		return row.id;
  }
  
  get filtered() {
		return Object.keys(this.filterForm?.value || '').some(
			col => !!this.filterForm!.value[col]
		);
	}

  constructor(
    public afs: AngularFirestore,
    private fb: FormBuilder,
    private matDialog: MatDialog,
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.buildFilterForm();
    // this.dataSource.filterPredicate = (col, filter) => {
		// 	return Object.keys(filter)
		// 		.map((filterKey) => {
		// 			let searchTerm = String(filter[filterKey] || "");
		// 			let cell = String(this.cell(col, filterKey) || "");
		// 			// if (filterKey=='author.displayName') {
		// 			// 	console.clear();
		// 			// 	console.log({cell, searchTerm, filterKey, filterKeyParts: filterKey.split('.'), col, filter});
		// 			// }
		// 			return (
		// 				cell.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
		// 				-1
		// 			);
		// 		})
		// 		.every(v => v);
		// };
  }

  buildFilterForm() {
		const controlsName: Record<string, any> = {};
		for (const col of this.displayedColumns) {
			controlsName[col] = [];
		}
		this.filterForm = this.fb.group(controlsName);
		if (
			this._filterFormSubscription &&
			this._filterFormSubscription.unsubscribe
		) {
			this._filterFormSubscription.unsubscribe();
		}
		this._filterFormSubscription = this.filterForm.valueChanges
			.pipe(takeWhile(() => this._alive))
			.subscribe(v => {
				this.paginator!.pageIndex = 0;
				this.dataSource.filter = v;
			});
  }

  add() {
    this.matDialog.open(FormComponent,{
      width:'650px'
    });
  }
}
