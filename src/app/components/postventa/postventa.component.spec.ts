import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaComponent } from './postventa.component';

describe('PostventaComponent', () => {
  let component: PostventaComponent;
  let fixture: ComponentFixture<PostventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
