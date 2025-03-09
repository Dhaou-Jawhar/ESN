import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteClientsComponent } from './societe-clients.component';

describe('SocieteClientsComponent', () => {
  let component: SocieteClientsComponent;
  let fixture: ComponentFixture<SocieteClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocieteClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
