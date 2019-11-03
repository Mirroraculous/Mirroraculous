import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEventComponent } from './details-event.component';

describe('DetailsEventComponent', () => {
  let component: DetailsEventComponent;
  let fixture: ComponentFixture<DetailsEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
