import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDashboardUserComponent } from './menu-dashboard-user.component';

describe('MenuDashboardUserComponent', () => {
  let component: MenuDashboardUserComponent;
  let fixture: ComponentFixture<MenuDashboardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDashboardUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuDashboardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
