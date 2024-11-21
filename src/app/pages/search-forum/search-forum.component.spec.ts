import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForumComponent } from './search-forum.component';

describe('SearchForumComponent', () => {
  let component: SearchForumComponent;
  let fixture: ComponentFixture<SearchForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
