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

import { Observable, Subscription } from "rxjs";
import { filter, map, mergeMap, switchMap, takeWhile } from "rxjs/operators";
import { FormComponent } from '../form/form.component';
import { Backlog } from '../types/backlog';
import { FilterComponent } from '../filter/filter.component';
import { FilterService } from '../filter.service';
import { PERSONIL_PID } from '../data/personil';

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
    private filterService: FilterService
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
    this.filterService
      .filterForm
      .valueChanges
      .pipe(
        mergeMap(formValue => {
          return this.afs.collection<Backlog>('backlog')
                  .valueChanges()
                  .pipe(
                    map(backlogCollection => {
                      return backlogCollection
                        // filter personil by pid
                        .filter(backlog => {
                          const selectedPersonilPid = formValue.pid.length > 0
                              ? formValue.pid
                              : PERSONIL_PID;
                          return selectedPersonilPid.includes(backlog.pid);
                        })
                        // filter project
                        .filter(backlog => {
                          const q = formValue.project ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.project
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        })
                        // filter product
                        .filter(backlog => {
                          const q = formValue.product ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.product
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        })
                        // filter additionTask
                        .filter(backlog => {
                          const q = formValue.additionTask ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.additionTask
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        })
                        // filter module
                        .filter(backlog => {
                          const q = formValue.module ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.module
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        })
                        // filter date_start
                        // filter date_target
                        // filter date_finish
                        // filter status
                        // filter effort
                        // filter activity
                        .filter(backlog => {
                          const q = formValue.activity ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.activity
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        })
                        // filter blockers
                        .filter(backlog => {
                          const q = formValue.blockers ?? '';
                          if (q == '') {
                            return true;
                          }
                          return backlog.blockers
                            .toLowerCase().indexOf(
                              q.toLowerCase()
                            ) > -1;
                        });
                    })
                  )
        })
      )
      .subscribe((data)=>{
        this.dataSource.data = data;
      });
    this.viewColumnCtrl.valueChanges
      .subscribe((value: string[])=>{
        this.displayedColumns = ['name',...value, 'action'];
      });

    this.filterService.filterForm
      .get('status')?.setValue(['Off Track','On Track','At Risk','Completed']);
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
