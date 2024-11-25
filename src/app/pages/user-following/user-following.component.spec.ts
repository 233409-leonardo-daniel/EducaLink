import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFollowingComponent } from './user-following.component';

describe('UserFollowingComponent', () => {
  let component: UserFollowingComponent;
  let fixture: ComponentFixture<UserFollowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFollowingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
