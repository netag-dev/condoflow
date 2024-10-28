import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponivelComponent } from './disponivel.component';

describe('DisponivelComponent', () => {
  let component: DisponivelComponent;
  let fixture: ComponentFixture<DisponivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponivelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisponivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
