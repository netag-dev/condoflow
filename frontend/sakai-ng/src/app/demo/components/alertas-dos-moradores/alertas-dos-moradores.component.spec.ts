import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasDosMoradoresComponent } from './alertas-dos-moradores.component';

describe('AlertasDosMoradoresComponent', () => {
  let component: AlertasDosMoradoresComponent;
  let fixture: ComponentFixture<AlertasDosMoradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasDosMoradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertasDosMoradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
