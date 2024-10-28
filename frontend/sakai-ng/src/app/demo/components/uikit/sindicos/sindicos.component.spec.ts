import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SindicosComponent } from './sindicos.component';

describe('SindicosComponent', () => {
  let component: SindicosComponent;
  let fixture: ComponentFixture<SindicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SindicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SindicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
