import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLineChartComponent } from './card-line-chart.component';

describe('CardLineChartComponent', () => {
  let component: CardLineChartComponent;
  let fixture: ComponentFixture<CardLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardLineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
