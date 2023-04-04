import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightPostComponent } from './light-post.component';

describe('LightPostComponent', () => {
  let component: LightPostComponent;
  let fixture: ComponentFixture<LightPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
