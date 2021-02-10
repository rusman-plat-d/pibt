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
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { Subscription } from "rxjs";
import { map, takeWhile } from "rxjs/operators";
import { FormComponent } from '../form/form.component';
import { Backlog } from '../types/backlog';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy, OnInit {
	private _alive = true;
	private _filterFormSubscription?: Subscription;
  dataSource = new MatTableDataSource<Backlog>();
  formDialog: MatDialogRef<FormComponent> | null = null;
  filterDialog: MatDialogRef<FilterComponent> | null = null;
  viewColumnCtrl = new FormControl([
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
    'action',
  ]);
  displayedColumns = this.viewColumnCtrl.value;
  filterForm?: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
	@ViewChild(MatSort) sort: MatSort | null = null;

  trackBy = (row: Backlog) => {
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
    this.afs.collection<Backlog>('backlog')
      .snapshotChanges()
      .pipe(
        map((data)=>data.map(a => ({
            ...a.payload.doc.data(),
            id: a.payload.doc.id,
          })))
      )
      .subscribe((data)=>{
        console.log(108, data);
        this.dataSource.data = data;
      });
    this.viewColumnCtrl.valueChanges
    .subscribe((value: string[])=>{
      this.displayedColumns = ['name',...value, 'action'];
    });
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
    this.formDialog = this.matDialog.open(FormComponent,{
      width:'650px',
      data: {
        showCloseCheckbox: false,
      }
    });

    this.formDialog.componentInstance
      .submit
      .pipe(
        takeWhile(()=>this._alive)
      )
      .subscribe((closeAfterSubmit: boolean)=> {
        this.formDialog?.close();
        this.formDialog = null;
        if (!closeAfterSubmit) {
          this.add();
        }
      });
  }

  edit(id: string) {
    this.formDialog = this.matDialog.open(FormComponent,{
      width:'650px',
      data: {
        id,
      }
    });

    this.formDialog.componentInstance
      .submit
      .pipe(
        takeWhile(()=>this._alive)
      )
      .subscribe((closeAfterSubmit: boolean)=> {
        this.formDialog?.close();
        this.formDialog = null;
        if (!closeAfterSubmit) {
          this.add();
        }
      });
  }

  delete(id: string) {

  }

  openFilterForm() {
    this.filterDialog = this.matDialog.open(FilterComponent);
  }
}
