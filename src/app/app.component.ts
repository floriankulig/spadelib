import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpadeButtonComponent } from '../lib/components/button/button.component';
import { DropdownOption } from '../lib/components/dropdown/dropdown';
import { SpadeInputComponent } from '../lib/components/input/input.component';
import { SpadeDropdownComponent } from '../lib/components/dropdown/dropdown.component';
import { SpadeChipComponent } from '../lib/components/chip/chip.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SpadeButtonComponent,
    SpadeInputComponent,
    SpadeDropdownComponent,
    SpadeChipComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class App {
  // Button demo states
  buttonLoading = false;

  // Input demo states
  inputValue = '';
  emailValue = '';

  // Dropdown demo states
  singleSelectValue: any = null;
  multiSelectValues: any[] = [];

  dropdownOptions: DropdownOption[] = [
    {
      value: 'angular',
      label: 'Angular',
      icon: '🅰️',
      description: 'TypeScript-based framework',
    },
    {
      value: 'react',
      label: 'React',
      icon: '⚛️',
      description: 'JavaScript library for UI',
    },
    {
      value: 'vue',
      label: 'Vue',
      icon: '💚',
      description: 'Progressive framework',
    },
    {
      value: 'svelte',
      label: 'Svelte',
      icon: '🔥',
      description: 'Compile-time optimized',
    },
    {
      value: 'solid',
      label: 'SolidJS',
      icon: '⚡',
      description: 'Fine-grained reactivity',
    },
  ];

  availableTags = [
    { id: 'angular', label: 'Angular' },
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'css', label: 'CSS' },
  ];

  onButtonClick(): void {
    this.buttonLoading = true;
    setTimeout(() => {
      this.buttonLoading = false;
      console.log('Button action completed!');
    }, 2000);
  }

  onInputChange(value: string): void {
    console.log('Input changed:', value);
  }

  onDropdownChange(value: any): void {
    console.log('Dropdown changed:', value);
  }
}
