import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TaskLayout } from '../setup/task-layout/task-layout';
import { PlusIcon } from './plus-icon/plus-icon';
import { SpadeButton } from './spade-button/spade-button.component';

@Component({
  selector: 'app-task-button',
  imports: [TaskLayout, SpadeButton, PlusIcon, MatButtonModule],
  templateUrl: './task-button.html',
  styleUrl: './task-button.scss',
})
export class TaskButton {}
