import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLabelsComponent } from './chart-labels.component';

describe('ChartLabelsComponent', () => {
  let component: ChartLabelsComponent;
  let fixture: ComponentFixture<ChartLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartLabelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
