import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindashboarComponent } from './admindashboar.component';

describe('AdmindashboarComponent', () => {
  let component: AdmindashboarComponent;
  let fixture: ComponentFixture<AdmindashboarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmindashboarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmindashboarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
