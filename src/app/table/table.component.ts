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
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy, OnInit {

  constructor() { }

  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }

}
