import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { event } from 'jquery';

@Component({
  selector: 'app-inventory-card',
  templateUrl: './inventory-card.component.html',
  styleUrls: ['./inventory-card.component.scss']
})
export class InventoryCardComponent{
 @Input('data') data:any;
 @Input('active') active:any;


}
