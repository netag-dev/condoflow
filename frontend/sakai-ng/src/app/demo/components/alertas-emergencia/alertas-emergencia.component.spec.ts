import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasEmergenciaComponent } from './alertas-emergencia.component';

describe('AlertasEmergenciaComponent', () => {
  let component: AlertasEmergenciaComponent;
  let fixture: ComponentFixture<AlertasEmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasEmergenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertasEmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
