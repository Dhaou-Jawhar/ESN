import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatDataComponent } from './candidat-data.component';

describe('CandidatDataComponent', () => {
  let component: CandidatDataComponent;
  let fixture: ComponentFixture<CandidatDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandidatDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
