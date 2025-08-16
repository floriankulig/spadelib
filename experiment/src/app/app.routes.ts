import { Routes } from '@angular/router';
import { Instructions } from './setup/instructions/instructions';
import { TaskButton } from './task-button/task-button';
import { TaskInput } from './task-input/task-input';
import { TaskDropdown } from './task-dropdown/task-dropdown';
import { TaskFeedback } from './setup/task-feedback/task-feedback';

export const routes: Routes = [
  { path: '', redirectTo: '/instructions', pathMatch: 'full' },
  { path: 'instructions', component: Instructions },
  { path: 'task-button', component: TaskButton },
  { path: 'task-input', component: TaskInput },
  { path: 'task-dropdown', component: TaskDropdown },
  { path: 'feedback', component: TaskFeedback },
];
