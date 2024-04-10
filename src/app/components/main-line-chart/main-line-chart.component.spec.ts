import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLineChartComponent } from './main-line-chart.component';

describe('MainLineChartComponent', () => {
  let component: MainLineChartComponent;
  let fixture: ComponentFixture<MainLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainLineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
