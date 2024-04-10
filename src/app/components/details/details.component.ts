import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{

  backlogProjects:any=[];
  pendingProjects:any=[];
  finalProjects:any=[];
  inventoryArray:any=[];
  paginator=[false,true,false,false,false];
  activeArr:any=[];
  selectedData:any
  hidebar=false;

  constructor(private apiService:ApiServiceService,private router:Router){

  }

  ngOnInit(): void {
      let data=this.apiService.projectLevelDetails.filter(x=>x.name===this.apiService.redirectId)[0];
      console.log(data)
      this.backlogProjects=data.projects.filter((x:any)=>x.status=='Backlog');
      this.pendingProjects=data.projects.filter((x:any)=>x.status=='Pending');
      this.finalProjects=data.projects.filter((x:any)=>x.status=='Final') || [];
      this.inventoryArray=this.backlogProjects;
      this.setActive(0)
  }

  selectNavItem(event:any,type:any){
    Array.from(document.getElementsByClassName('nav-item')).forEach(element => {
      element.classList.remove('active-nav')
    });
    event.currentTarget.classList.add('active-nav')

    if(type=='Backlog'){
      this.inventoryArray=this.backlogProjects;
      this.setActive(0)
    }
    else if(type=='Pending'){
      this.inventoryArray=this.pendingProjects;
      this.setActive(0)
    }
    else if(type=='Final'){
      this.inventoryArray=this.finalProjects;
      this.setActive(0)
    }
  }

  selectCard(event:any,selectedData:any,index:any){
    this.setActive(index);
    console.log(this.selectedData);
  }
  setActive(index:any){
    this.selectedData=this.inventoryArray[index];
    console.log(this.selectedData);
    this.activeArr=[]
    for(let i=0;i<this.inventoryArray.length;i++){
      this.activeArr.push(false);
    }
    this.activeArr[index]=true;
  }
  hideLeftBar(){
    this.hidebar=!this.hidebar;
  }

  navigateBack(){
    this.router.navigate([''])
  }

}
