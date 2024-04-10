import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapDashboardComponent } from './components/map-dashboard/map-dashboard.component';
import { CardDashboardComponent } from './components/card-dashboard/card-dashboard.component';
import { CardLineChartComponent } from './components/card-line-chart/card-line-chart.component';
import { DetailsComponent } from './components/details/details.component';
import { HeaderComponent } from './components/header/header.component';
import { InventoryCardComponent } from './components/inventory-card/inventory-card.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { MainLineChartComponent } from './components/main-line-chart/main-line-chart.component';
import { ChartLabelsComponent } from './components/chart-labels/chart-labels.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    MapDashboardComponent,
    CardDashboardComponent,
    CardLineChartComponent,
    DetailsComponent,
    HeaderComponent,
    InventoryCardComponent,
    MainLineChartComponent,
    ChartLabelsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IvyCarouselModule,
    NgCircleProgressModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
