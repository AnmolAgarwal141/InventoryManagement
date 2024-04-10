import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapDashboardComponent } from './components/map-dashboard/map-dashboard.component';
import { DetailsComponent } from './components/details/details.component';
import { MainLineChartComponent } from './components/main-line-chart/main-line-chart.component';

const routes: Routes = [

  {path:'',children:[
    {path:'',component:MapDashboardComponent},
    {path:'details',component:DetailsComponent}
  ]}    
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
