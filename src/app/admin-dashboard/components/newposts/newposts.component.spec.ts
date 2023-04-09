import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpostsComponent } from './newposts.component';

describe('NewpostsComponent', () => {
  let component: NewpostsComponent;
  let fixture: ComponentFixture<NewpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
