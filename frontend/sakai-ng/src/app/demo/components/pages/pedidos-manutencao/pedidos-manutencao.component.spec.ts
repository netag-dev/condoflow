import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosManutencaoComponent } from './pedidos-manutencao.component';

describe('PedidosManutencaoComponent', () => {
  let component: PedidosManutencaoComponent;
  let fixture: ComponentFixture<PedidosManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosManutencaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PedidosManutencaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
