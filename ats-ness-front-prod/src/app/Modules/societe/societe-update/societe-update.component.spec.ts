import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteUpdateComponent } from './societe-update.component';

describe('SocieteUpdateComponent', () => {
  let component: SocieteUpdateComponent;
  let fixture: ComponentFixture<SocieteUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocieteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
