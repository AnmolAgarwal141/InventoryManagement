import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss']
})
export class CardDashboardComponent implements OnChanges{

  @Input('cardData') cardData:any;
  data1:any;
  data2:any;

  ngOnChanges(changes: SimpleChanges): void {
    this.data1={title:'Historical',chartValue:this.cardData.TotalConsumption,name:this.cardData.name,id:this.cardData.name+'1'};
    this.data2={title:'Forecast',chartValue:this.cardData.forecastPercent,name:this.cardData.name,id:this.cardData.name+'2'};
  }
  
}
