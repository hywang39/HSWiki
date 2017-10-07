import {Component, OnInit} from '@angular/core';
import {Set} from './set';
import {SetService} from './set.service';
import {MainComponent} from './main.component';

@Component({
  selector: 'app-card-filter',
  template:
      `
    <!--<div id="card_set_filter">-->
      <!--<label>Card Set:</label><br>-->
      <!--<select id="card_set_selection">-->
        <!--<option value="" selected disabled hidden>Choose card set here</option>-->
        <!--<option *ngFor="let set of sets" value="{{set.name}}">-->
          <!--&lt;!&ndash;[class.selected]="set === selectedSet"&ndash;&gt;-->
          <!--&lt;!&ndash;(click)="onSelect(set)">&ndash;&gt;{{set.name}}-->
        <!--</option>-->
      <!--</select>-->
      <!--<button (click)="filtering()">Filter</button>-->
    <!--</div>-->

  `,
  // style: '',
  providers: [SetService],
})

export class FilterComponent implements OnInit {
  sets: Set[];
  selectedSet: Set;

  constructor(private setService: SetService) {

  }

  getSets(): void {
    this.setService.getSets().then(sets => this.sets = sets);
  }

  ngOnInit(): void {
    this.getSets();
  }

  onSelect(set: Set): void {
    this.selectedSet = set;
  }


}
