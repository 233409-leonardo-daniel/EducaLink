import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalePostComponent } from './create-sale-post.component';

describe('CreateSalePostComponent', () => {
  let component: CreateSalePostComponent;
  let fixture: ComponentFixture<CreateSalePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSalePostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSalePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
