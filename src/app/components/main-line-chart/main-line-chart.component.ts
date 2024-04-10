import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-main-line-chart',
  templateUrl: './main-line-chart.component.html',
  styleUrls: ['./main-line-chart.component.scss']
})
export class MainLineChartComponent implements OnChanges{

    @Input('data') jsondata:any;

  data:any
  labelData=[
    {color:'#208127',title:'AI FORECAST', progress:0,progressFlag:true,type:'solid',property:'AIValue'},
    {color:'#9f9c0c',title:'FINAL FORECAST', progress:0,progressFlag:true,type:'solid',property:'finalValue'},
    {color:'#5485b1',title:'Consumption', progress:0,progressFlag:false,type:'solid',property:'consumptionValue'},
    {color:'#164f1f',title:'AI FORECAST', progress:0,progressFlag:false,type:'dotted'},
    {color:'#a4a00d',title:'FINAL FORECAST', progress:0,progressFlag:false,type:'dotted'},
    {color:'#7f6769',title:'PREVIOUS QUATER FINAL FORECAST', progress:0,progressFlag:false,type:'dotted'}
  ]
  Colours=["#208127","#9f9c0c","#5485b1","#164f1f","#a4a00d","#7f6769"]

  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.jsondata)
      this.labelData[0].progress=this.jsondata.forecastPercent1.split('%')[0];
      this.labelData[1].progress=this.jsondata.forecastPercent2.split('%')[0];
      this.data=this.jsondata.chartData;
      (<HTMLElement>document.getElementById("linechart"))!.innerHTML=''
      this.drawChart()
  }

//   ngAfterViewInit(): void {
//       this.drawChart()
//   }

  drawChart(){
    var margin = {top: 30, right: 150, bottom: 40, left: 60};
    var width = 940 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    var dataGroup = d3.select("#linechart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + (margin.left+30) + ", " + margin.top + ")");

    var parseTime = d3.timeParse("%m/%d/%Y");

    // this.data.forEach(function (d:any) {
    //   console.log(d.date)
    //   d.date = parseTime(d.date);
    //   console.log(d.date);
    // });
    let val1:any=d3.extent(this.data, function (d:any) { return d.date; });
    console.log(val1);

    var x = d3.scaleTime()
    .domain(val1)
    .range([0, width]);

    var y1 = d3.scaleLinear()
    .domain([100000,1000000])
    .range([height, 0])
    .nice();

    var Values1 = ["AIValue"];
    var Values2 = ["finalValue"];
    var Values3 = ["consumptionValue"];
    var Values4 = ["forecastAIValue"];
    var Values5 = ["forecastfinalValue"];
    var Values6 = ["PreValue"];


    var allValues: { color: string; title: string; }[] = [];

    for (var i = 0; i < Values1.length; i++) {
        plotVariableLeft(this.data,Values1[i], this.Colours[0],"solid");
        allValues.push({ color: this.Colours[0], title: Values1[i]});
    }

    for (var i = 0; i < Values2.length; i++) {
        plotVariableLeft(this.data,Values2[i], this.Colours[1],"solid");
        allValues.push({ color: this.Colours[1], title: Values2[i]});
    }
    for (var i = 0; i < Values3.length; i++) {
        plotVariableLeft(this.data,Values3[i], this.Colours[2],"solid");
        allValues.push({ color: this.Colours[2], title: Values3[i]});
    }
    for (var i = 0; i < Values4.length; i++) {
        console.log(Values4)
        plotVariableLeft(this.data,Values4[i], this.Colours[3],"dashed");
        allValues.push({ color: this.Colours[3], title: Values4[i]});
    }
    for (var i = 0; i < Values5.length; i++) {
        plotVariableLeft(this.data,Values5[i], this.Colours[4],"dashed");
        allValues.push({ color: this.Colours[4], title: Values5[i]});
    }
    for (var i = 0; i < Values6.length; i++) {
        plotVariableLeft(this.data,Values6[i], this.Colours[5],"dashed");
        allValues.push({ color: this.Colours[5], title: Values6[i]});
    }

    function plotVariableLeft(data:any, propertyName:any, colour:any,type:any) {
        let fn=function (d:any) { return d[propertyName]}
      var line = d3.line()
          .defined(fn)
          .x((d:any) => x(d.date))
          .y(d => y1(d[propertyName]));
        //   .curve(d3.curveMonotoneX);
    
    if(type=='solid'){
        dataGroup.append("path")
          .data([data])
          .attr("id",propertyName)
          .attr("fill", "none")
          .attr("stroke", colour)
          .attr("d", line);
    }
    else if(type=='dashed'){
        dataGroup.append("path")
          .data([data])
          .attr("fill", "none")
          .attr("stroke", colour)
          .style("stroke-dasharray", ("3, 3"))
          .attr("d", line);
    }
      
      
    }

  var xAxisGroup = dataGroup
                    .append("g")
                    .attr("class", "xAxisGroup")
                    .attr('style','color:#cccccc80')
                    .attr("transform", "translate(0," + (height + 10) + ")");
  let format:any=d3.timeFormat("%b %y")
  var xAxis = d3.axisBottom(x)
            .tickValues(this.data.map((d:any) => d.date))
            .tickFormat(format);

  xAxis(xAxisGroup);

  d3.selectAll("g.xAxisGroup g.tick") 
  .append("line") 
      .attr("class", "gridline")
      .attr("x1", 0) 
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -height)
      .style("stroke","#14202b");

  var y1AxisGroup = dataGroup
                    .append("g")
                    .attr("class", "yAxisGroup")
                    .attr('style','color:#cccccc80')
                    .attr("transform", "translate( " + -10 + ", 0 )");


  var y1Axis = d3.axisLeft(y1);

  y1Axis(y1AxisGroup);

//   xAxisLabel(dataGroup, "Date");
  y1AxisLabel(dataGroup, "CONSUMPTION");

  function xAxisLabel(dg:any, text:any) {
      dg.append("text")
          .attr("transform", "translate(" + (width / 2) + " ," + 
                                            (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .attr('style','fill:#CCC')
          .text(text);
  }

  function y1AxisLabel(dg:any, text:any) {
      dg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left -20)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("fill","#CCC")
          .style("font-size","11px")
          .style("font-weight",500) 
          .text(text);
  }

  circlePointsLeft(this.data,Values1, dataGroup,this.Colours[0]);
  circlePointsLeft(this.data,Values2, dataGroup,this.Colours[1]);
  circlePointsLeft(this.data,Values3, dataGroup,this.Colours[2])
  circlePointsLeft(this.data,Values4, dataGroup,this.Colours[3])
  circlePointsLeft(this.data,Values5, dataGroup,this.Colours[4])
  circlePointsLeft(this.data,Values6, dataGroup,this.Colours[5])

  function circlePointsLeft(data:any,propertyNames:any, dg:any,color:any) {
    let count=0;
      data.forEach(function (point:any) {
        count=count+1
          for (var i = 0; i < propertyNames.length; i++) {
            if(point[propertyNames[i]]){
                dg.append("circle")
                .attr("fill", color)
                .attr("r", 3)
                .attr('class',propertyNames[i]+'class')
                .attr("cx", x(point.date))
                .attr("cy", y1(point[propertyNames[i]]))
                .append("title")
                .text("Date: " + point.date + "\n" + propertyNames[i] + ": " + point[propertyNames[i]]);
            }

          }
      });
  }


//   drawLegend(dataGroup);

  function drawLegend(dg:any) {
      var legend = dg
        .append("g")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("fill", "none")
        .attr("width", width)
        .attr("height", height);


      allValues.forEach(function (x, i) {
        legend.append("rect")
            .attr("fill", x.color)
            .attr("x", width + 60)
            .attr("y", i * 25)
            .attr("width", 30)
            .attr("height", 3)
            .append("title")
            .text(x.title);

        var title = x.title.length < 8 ? x.title : x.title.substring(0, 8) + "...";

        legend.append("text")
            .text(title)
            .attr("font-size", "12pt")
            .attr("fill", x.color)
            .attr("x", width + 95)
            .attr("y", i * 25 + 8);

    });
  }


  const refLineValues = { x1Value: '07/22/2024', x2Value: '07/22/2024', y1Value: 75000,  y2Value: 1200000};
  referenceLine(dataGroup, refLineValues.x1Value, refLineValues.x2Value, refLineValues.y1Value, refLineValues.y2Value);

  function referenceLine(dg:any, x1Value:any, x2Value:any, y1Value:any, y2Value:any) {
    let val5:any=parseTime(x1Value);
    let val6:any=parseTime(x2Value);
      dg.append('line')
          .attr('x1', x(val5))
          .attr('y1', y1(y1Value))
          .attr('x2', x(val6))
          .attr('y2', y1(y2Value))
          .attr('class', 'refLine')
          .style("stroke-dasharray", ("3, 3"))
          .style('stroke','#393f42');
  }

  }

  toggleLineChart(event:any,data:any){
    console.log(event,data.property)
    if(event){
        document.getElementById(data.property)?.classList.add('d-none');
        Array.from(document.getElementsByClassName(data.property+'class')).forEach(element => {
            element.classList.add('d-none');
        });
    }
    else{
        document.getElementById(data.property)?.classList.remove('d-none');
        Array.from(document.getElementsByClassName(data.property+'class')).forEach(element => {
            element.classList.remove('d-none');
        });
    }
    
    console.log(document.getElementById(data.property))
  }

  }
