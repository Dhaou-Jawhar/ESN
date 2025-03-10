import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsAddComponent } from './actions-add.component';

describe('ActionsAddComponent', () => {
  let component: ActionsAddComponent;
  let fixture: ComponentFixture<ActionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
