import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import * as d3 from 'd3';
// import { InternationalizationService } from '../../utils/internationalization.service';
import { Subscription } from 'rxjs';
import { ApiServiceService } from 'src/app/api-service.service';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.scss']
})

export class MapDashboardComponent implements OnInit{

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef<SVGElement>;
  data: any[] = []
  totalProperties: number = 3;
  lang: string = "ar";
  layout="top-card"
  filterdata:any;
  lower=0;
  higher=4;
  direction='row';
  private _subscriptions: Subscription = new Subscription();

  constructor(private apiservice:ApiServiceService,private router:Router) { }

  ngOnInit() {
    this.data=this.apiservice.countryData;
    this.filterdata=this.data.slice(this.lower,this.higher)
    this.drawChart();
    this.listenToLanguageChange();
    let _this=this;
    window.addEventListener("resize", function(event) {
      console.log(document.body.clientWidth + ' wide by ' + document.body.clientHeight+' high');
      if(_this.direction=='row'){
        if(document.body.clientWidth<630){
          console.log('here2')
          _this.lower=0;
          _this.higher=1;
          _this.filterdata=_this.data.slice(_this.lower,_this.higher)
        }
        else if(document.body.clientWidth<898){
          console.log('here2')
          _this.lower=0;
          _this.higher=2;
          _this.filterdata=_this.data.slice(_this.lower,_this.higher)
        }
        else if(document.body.clientWidth<1170){
          console.log('here')
          _this.lower=0;
          _this.higher=3;
          _this.filterdata=_this.data.slice(_this.lower,_this.higher)
        }
        else{
          console.log('here')
          _this.lower=0;
          _this.higher=4;
          _this.filterdata=_this.data.slice(_this.lower,_this.higher)
        }
      }

    })
  }

  private listenToLanguageChange(): void {
    // this._subscriptions.add(
    //   this.internalizationService.languageChanged$.subscribe((currentLang:any) => {
    //     this.lang = currentLang;
    //   })
    // );
  }

  propertyPercentage(properties: string): number {
    const percentage = Math.round((parseInt(properties) / this.totalProperties) * 100);
    return percentage;
  }
  drawChart() {
    const chart = d3.select(this.chartContainer.nativeElement);
    const width = +chart.attr('width');
    const height = +chart.attr('height');

    // Define the projection
    const projection = d3.geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5]);

    // Define the path generator
    const path = d3.geoPath().projection(projection);

    // Load the world map data
    d3.json('assets/world.json').then((worldData: any) => {
      // Access the features in GeoJSON data
      const countries = worldData.features;

      // Draw the map
      chart.selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('d', <any>path) // Use <any> to handle typing issue
        .attr('fill', 'black')
        .attr('stroke', '#c0c0c0')
        .attr('stroke-width', 0.1);

      // Add bubbles from the input data
      var mycircle=chart.selectAll('circle')
        .data(this.data)
        .enter().append('circle')
//depending on what you are reading, cx and cy can be altered.
//In this scenario, cx and cy are being calculated from world-map.ts coordinated
//I personally recommend having in our shared data a defined longitude and lattitude 
// as this approach below is not 100% accurate for countries defined as Multipolygone

        .attr('cx', d => {
          console.log(d);
          const coordinates = this.findCountryCoordinates(d.name, countries);
          const geometry = this.findCountryGeometry(d.name, countries);
          if (geometry === "MultiPolygon") {
            var center = this.calculateMultiPolygonCenter(coordinates);
            // console.log(`${d.name} has x= ${center.x}`);
            return center.x;
          } else if (coordinates && coordinates.length >= 2) {
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            const projected = projection([longitude, latitude]);
            if (projected) {

              return projected[0];

            } else {
              console.error('Invalid projection for:', d.name);
            }
          } else {
            console.error('Invalid coordinates for:', d.name);
          }
          return 0;
        })
        .attr('cy', d => {
          const coordinates = this.findCountryCoordinates(d.name, countries);
          const geometry = this.findCountryGeometry(d.name, countries);
          if (geometry === "MultiPolygon") {
            var center = this.calculateMultiPolygonCenter(coordinates);
            // console.log(`${d.name} has y= ${center.x}`);
            return center.y;
          } else if (coordinates && coordinates.length >= 2) {
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            const projected = projection([longitude, latitude]);
            if (projected) {
              return projected[1];
            } else {
              console.error('Invalid projection for:', d.name);
            }
          } else {
            console.error('Invalid coordinates for:', d.name);
          }
          return 0;
        })
//defin the rayon of our s=circle, color (fill and strock), opacity and strock width
        .attr('r', d => this.propertyPercentage(d.properties)/5)
        .attr('fill', d => d.color)
        .attr('opacity', 0.6)
        .attr('stroke', '#4F4F4F')
        .attr('stroke-width', 0.5)
        .attr('class', 'circlevals')
        .attr('id',d=>d.name)
//d.nameAr is used as I'm setting eng and arabic name
//DON'T FORGET TO CUSTOMIZE YOUR TOOLTIP BELOW
        .append('title').text(d => `${d.nameAr} - ${d.name}`);
         //used as a tooltip
        let _this=this;
        $('.circlevals').on('click', function(e){
          _this.apiservice.redirectId=e.target.id;
          _this.router.navigate(['/details'])
      });
         
    });

    
  }

  findCountryCoordinates(countryName: string, countries: any[]) {
    // Loop through the countries array to find the country with the matching name
    for (const country of countries) {
      if (country.properties.name === countryName) {
        const geometry = country.geometry;
        if (geometry.type === 'Polygon') {
          return geometry.coordinates[0][0];
        } else if (geometry.type === 'MultiPolygon') {
          const polygons = geometry.coordinates;
          return polygons
          // .reduce((acc: number[], polygon: number[][]) => {
          //   const coordinates = polygon[0];
          //   return acc.concat(coordinates);
          // }, []);
        }
      }
    }
    console.error('Coordinates not found for:', countryName);
    return null; // Country not found
  }
  findCountryGeometry(countryName: string, countries: any[]) {
    // Loop through the countries array to find the country with the matching name
    for (const country of countries) {
      if (country.properties.name === countryName) {
        const geometry = country.geometry.type;
        return geometry;
      }
    }
    console.error('Coordinates not found for:', countryName);
    return null; // Country not found
  }

//to calculate the center point of multipolygone countries
  calculateMultiPolygonCenter(multiPolygon: number[][][][]): Point {
    let totalX = 0;
    let totalY = 0;
    let pointCount = 0;
    // console.log('multi: ' + multiPolygon);
    for (const polygon of multiPolygon) {
      // console.log('poly:' + polygon)
      for (const ring of polygon) {
        // console.log('ring:' + ring);
        for (const point of ring) {
          // console.log('point:' + point);
          totalX += point[0];
          totalY += point[1];
          pointCount++;
        }
      }
    }

    if (pointCount === 0) {
      // Handle the case where there are no valid points
      return { x: 0, y: 0 };
    }

    const centerX = totalX / pointCount;
    const centerY = totalY / pointCount;

    return { x: centerX, y: centerY };
  }

  changeLayout(){
    console.log('here')
    if(this.layout=='top-card'){
      this.lower=0;
      this.higher=2;
      this.layout='right-card';
      this.direction='column'
    }
    else if(this.layout=='right-card'){
      this.lower=0;
      this.higher=4;
      this.layout='bottom-card';
      this.direction='row'
    }
    else if(this.layout=='bottom-card'){
      this.lower=0;
      this.higher=2;  
      this.layout='left-card';
      this.direction='column'
    }
    else if(this.layout=='left-card'){
      this.lower=0;
      this.higher=4;
      this.layout='top-card'
      this.direction='row'
    }
    this.filterdata=this.data.slice(this.lower,this.higher)
  }

  redirectToDetails(name:string){
    this.apiservice.redirectId=name;
    this.router.navigate(['/details'])
  }
  prevElement(){
    this.lower=this.lower-1;
    this.higher=this.higher-1;
    this.filterdata=this.data.slice(this.lower,this.higher)
  }
  nextElement(){
    this.lower=this.lower+1;
    this.higher=this.higher+1;
    this.filterdata=this.data.slice(this.lower,this.higher)
  }
}

