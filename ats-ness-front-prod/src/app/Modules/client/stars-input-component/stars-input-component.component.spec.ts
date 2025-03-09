import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsInputComponentComponent } from './stars-input-component.component';

describe('StarsInputComponentComponent', () => {
  let component: StarsInputComponentComponent;
  let fixture: ComponentFixture<StarsInputComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsInputComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StarsInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
