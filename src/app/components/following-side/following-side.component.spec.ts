import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingSideComponent } from './following-side.component';

describe('FollowingSideComponent', () => {
  let component: FollowingSideComponent;
  let fixture: ComponentFixture<FollowingSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowingSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
