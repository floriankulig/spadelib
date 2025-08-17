import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TaskLayout } from '../setup/task-layout/task-layout';
import { SpadeDropdownComponent } from '../components/spade-dropdown/spade-dropdown.component';

@Component({
  selector: 'app-task-dropdown',
  imports: [
    TaskLayout,
    SpadeDropdownComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './task-dropdown.html',
  styleUrl: './task-dropdown.scss',
})
export class TaskDropdown {
  mockOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'music', label: 'Music & Instruments' },
    { value: 'health', label: 'Health & Wellness' },
  ];
}
