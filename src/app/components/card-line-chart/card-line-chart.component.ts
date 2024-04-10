import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-card-line-chart',
  templateUrl: './card-line-chart.component.html',
  styleUrls: ['./card-line-chart.component.scss']
})
export class CardLineChartComponent implements OnChanges, AfterViewInit{
  @Input('configData') configData:any;
  filteredData:any;
  svg:any;
  xScale:any;
  yScale:any;
  line:any;
  toolTipDiv: any;
  constructor(private apiService:ApiServiceService){
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.configData);
    this.filteredData=this.apiService.dataDetails.filter((x:any)=>x.name===this.configData.name)
  }

  ngAfterViewInit() {
    var data:any;
    console.log(this.filteredData)
    if(this.configData.title=='Historical'){
      data=this.filteredData[0].historicalData;
    }
    else if(this.configData.title=='Forecast'){
      data=this.filteredData[0].futurePredication;
    }

    let val:any=d3.extent(data,(d:any)=>d.date)

    this.svg = d3.select('#'+this.configData.id)
      .append('svg')
      .attr('width', 140)
      .attr('height', 20);
    this.xScale = d3.scaleTime()
      .domain(val)
      .range([0, 140]);
    this.yScale = d3.scaleLinear()
      .domain([100000, 1000000])
      .range([20, 0]);
    this.line = d3.line()
      .x((d:any) => this.xScale(d.date))
      .y((d:any) => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    this.toolTipDiv = d3.select('#'+this.configData.id).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('color','#ccc')
      .style('font-size','12px')
      .style('position','absolute');
    
    this.svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', this.line);
    const axisBottomG=this.svg.append('g')
      .attr('transform', `translate(0, ${20})`)
      .call(d3.axisBottom(this.xScale));

    this.svg.append('text')
      .attr('transform', 'translate(' + (-20) + ',' + (20 + 13) + ')')
      .attr('dy', '.35em')
      .attr('class', ' xAxis')
      .text('Date');

    // this.appendCircles(data);
    circlePointsLeft(data,['value'],this.svg,this.xScale,this.yScale)

    function circlePointsLeft(data:any,propertyNames:any, dg:any,x:any,y:any) {
      let count=0;
        data.forEach(function (point:any) {
          count=count+1
            for (var i = 0; i < propertyNames.length; i++) {
              if(point[propertyNames[i]]){
                  dg.append("circle")
                  .attr("fill", 'steelblue')
                  .attr("r", 3)
                  .attr('class',propertyNames[i]+'class')
                  .attr("cx", x(point.date))
                  .attr("cy", y(point[propertyNames[i]]))
                  .append("title")
                  .text("Date: " + point.date + "\n" + propertyNames[i] + ": " + point[propertyNames[i]]);
              }
  
            }
        });
    }

    
  }
  appendCircles(data:any) {
    console.log(data)
    this.svg.selectAll('.developing')
    .data(data)
    .enter().append('circle')
    .attr('cx', (d:any) => this.xScale(d.date))
    .attr('cy', (d:any) => this.yScale(d.value))
    .attr('r', 2)
    .style('fill','steelblue')
    .append("title")
    .text();
  }
}
