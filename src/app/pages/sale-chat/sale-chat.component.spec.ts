import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleChatComponent } from './sale-chat.component';

describe('SaleChatComponent', () => {
  let component: SaleChatComponent;
  let fixture: ComponentFixture<SaleChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
