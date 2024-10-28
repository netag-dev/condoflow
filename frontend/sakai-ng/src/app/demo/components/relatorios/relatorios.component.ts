import { Component } from '@angular/core';

@Component({
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {

  activeIndex: number = 0;

  activeIndexChange(newIndex: number): void {
    this.activeIndex = newIndex;
  }


}
