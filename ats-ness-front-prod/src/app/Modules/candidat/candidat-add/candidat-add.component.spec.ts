import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatAddComponent } from './candidat-add.component';

describe('CandidatAddComponent', () => {
  let component: CandidatAddComponent;
  let fixture: ComponentFixture<CandidatAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandidatAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
