import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistergroupComponent } from './registergroup.component';

describe('RegistergroupComponent', () => {
  let component: RegistergroupComponent;
  let fixture: ComponentFixture<RegistergroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistergroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
