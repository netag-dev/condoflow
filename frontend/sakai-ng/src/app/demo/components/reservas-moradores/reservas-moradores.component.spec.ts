import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasMoradoresComponent } from './reservas-moradores.component';

describe('ReservasMoradoresComponent', () => {
  let component: ReservasMoradoresComponent;
  let fixture: ComponentFixture<ReservasMoradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasMoradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasMoradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
