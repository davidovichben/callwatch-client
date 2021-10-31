import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchboardsComponent } from './switchboards.component';

describe('SwitchboardsComponent', () => {
  let component: SwitchboardsComponent;
  let fixture: ComponentFixture<SwitchboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
