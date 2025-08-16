import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-task-layout',
  templateUrl: './task-layout.html',
  styleUrls: ['./task-layout.scss'],
  imports: [
    // CommonModule,
    MatTabsModule,
  ],
})
export class TaskLayout {
  @Input() taskNumber: number = 1;
  @Input() taskTitle: string = '';
  @Input() estimatedTime: string = '';
  @Input() taskDifficulty: string = 'easy';
  @Input() targetImageSrc?: string;
}
