import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxaComponent } from './taxa.component';

describe('TaxaComponent', () => {
  let component: TaxaComponent;
  let fixture: ComponentFixture<TaxaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
