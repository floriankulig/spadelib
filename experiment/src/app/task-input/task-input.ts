import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskLayout } from '../setup/task-layout/task-layout';
import { SpadeInputComponent } from '../components/spade-input/spade-input.component';

@Component({
  selector: 'app-task-input',
  imports: [
    TaskLayout,
    SpadeInputComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './task-input.html',
  styleUrl: './task-input.scss',
})
export class TaskInput {}
