import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteFormComponent } from './societe-form.component';

describe('SocieteFormComponent', () => {
  let component: SocieteFormComponent;
  let fixture: ComponentFixture<SocieteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocieteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
