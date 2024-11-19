import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewforumComponent } from './newforum.component';

describe('NewforumComponent', () => {
  let component: NewforumComponent;
  let fixture: ComponentFixture<NewforumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewforumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewforumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
