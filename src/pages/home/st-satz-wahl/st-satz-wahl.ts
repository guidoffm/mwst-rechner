import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'st-satz-wahl',
  templateUrl: 'st-satz-wahl.html'
})
export class StSatzWahl {

  @Input() steuersatz: string;
  @Output() steuersatzChanged: EventEmitter<string> = new EventEmitter();

  constructor() {

  }

  onChangeSelection(value) {
    this.steuersatzChanged.emit(value);
  }
}
