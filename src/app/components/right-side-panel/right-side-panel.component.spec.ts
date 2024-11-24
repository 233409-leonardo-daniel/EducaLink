import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSidePanelComponent } from './right-side-panel.component';

describe('RightSidePanelComponent', () => {
  let component: RightSidePanelComponent;
  let fixture: ComponentFixture<RightSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSidePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
