import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGroupComponent } from './register-group.component';

describe('RegisterGroupComponent', () => {
  let component: RegisterGroupComponent;
  let fixture: ComponentFixture<RegisterGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
