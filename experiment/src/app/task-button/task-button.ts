import { Component } from '@angular/core';
import { TaskLayout } from '../setup/task-layout/task-layout';
import { MaterialButton } from './material-button/material-button';
import { PlusIcon } from './plus-icon/plus-icon';
import { SpadeButton } from './spade-button/spade-button.component';

@Component({
  selector: 'app-task-button',
  imports: [TaskLayout, MaterialButton, SpadeButton, PlusIcon],
  templateUrl: './task-button.html',
  styleUrl: './task-button.scss',
})
export class TaskButton {}
