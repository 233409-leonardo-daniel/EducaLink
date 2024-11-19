import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfollowsComponent } from './myfollows.component';

describe('MyfollowsComponent', () => {
  let component: MyfollowsComponent;
  let fixture: ComponentFixture<MyfollowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyfollowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyfollowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
