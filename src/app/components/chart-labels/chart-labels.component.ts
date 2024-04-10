import { Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chart-labels',
  templateUrl: './chart-labels.component.html',
  styleUrls: ['./chart-labels.component.scss']
})
export class ChartLabelsComponent {
  @Input('data') data:any;
  @Output('switchToggle') switchToggle=new EventEmitter<any>


  valueChanged(event:any){
    console.log(event.currentTarget.checked)
    this.switchToggle.emit(event.currentTarget.checked)
    
  }

}
