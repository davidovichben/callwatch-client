import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComputedColumnComponent } from './add-computed-column.component';

describe('AddComputedColumnComponent', () => {
  let component: AddComputedColumnComponent;
  let fixture: ComponentFixture<AddComputedColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComputedColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComputedColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
