import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent {
  value = '';

  @Output() searchChange = new EventEmitter<string>();

  onInput() {
    this.searchChange.emit(this.value);
  }

  clear() {
    this.value = '';
    this.searchChange.emit('');
  }
}
