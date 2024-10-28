import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoManutencaoComponent } from './tipo-manutencao.component';

describe('TipoManutencaoComponent', () => {
  let component: TipoManutencaoComponent;
  let fixture: ComponentFixture<TipoManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoManutencaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoManutencaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
