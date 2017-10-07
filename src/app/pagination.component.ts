import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'app-pagination',
  template: `
    <ul class="pagination">
      <li (click)="selectPage(1, $event)" [class.disabled]="currentPage == 1">
        <a href="" title="Go to first page">&laquo;</a>
      </li>
      <li (click)="selectPage(currentPage - 1, $event)" [class.disabled]="currentPage == 1">
        <a href="" title="Go to previous page">&lsaquo;</a>
      </li>
      <li class="disabled" (click)="cancelEvent($event)" *ngIf="(currentPage - range) > 1">
        <a href="">...</a>
      </li>
      <li *ngFor="let page of pages | async" [class.active]="page == currentPage">
        <a href="javascript:void(0)" (click)="selectPage(page, $event)">
          {{page}}
        </a>
      </li>
      <li class="disabled" (click)="cancelEvent($event)" *ngIf="(currentPage + range) < totalPages">
        <a href="">...</a>
      </li>
      <li (click)="selectPage(currentPage + 1, $event)" [class.disabled]="currentPage == totalPages">
        <a href="" title="Go to next page">&rsaquo;</a>
      </li>
      <li (click)="selectPage(totalPages, $event)" [class.disabled]="currentPage == totalPages">
        <a href="" title="Go to last page">&raquo;</a>
      </li>
    </ul>
  `,
})


export class PaginationComponent implements OnInit, OnChanges {

  @Input() offset: number;
  @Input() limit: number;
  @Input() size: number;
  @Input() range: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  currentPage: number;
  totalPages: number;
  pages: Observable<number[]>;

  constructor() {

  }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
    console.log(this.pages);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    // this.pages = Observable.range(-this.range, this.range * 2 + 1)
    this.pages = Observable.range(1, 7)
      .map(off_set => this.currentPage + off_set)
      .filter(pageNr => this.isValidPageNumber(pageNr, this.totalPages))
      .toArray();
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  selectPage(page: number, event) {
    this.cancelEvent(event);
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.pageChange.emit((page - 1) * this.limit);
    }
  }

  cancelEvent(event) {
    event.preventDefault();
  }

}
