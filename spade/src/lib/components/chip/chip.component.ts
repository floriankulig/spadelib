import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'spade-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class SpadeChipComponent implements OnInit {
  @Input() variant:
    | 'primary'
    | 'secondary'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'error' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() removable = false;
  @Input() selected = false;
  @Input() value?: any; // Unique identifier for this chip
  @Input() ariaLabel?: string;
  @Input() removeAriaLabel = 'Remove';

  @Output() click = new EventEmitter<{ value: any; event: MouseEvent }>();
  @Output() remove = new EventEmitter<{ value: any; event: MouseEvent }>();

  @HostBinding('class.spade-chip-host') hostClass = true;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupAccessibility();
  }

  private setupAccessibility() {
    const chip = this.elementRef.nativeElement.querySelector('.spade-chip');
    if (!chip) return;

    // Ensure chip is keyboard accessible
    if (this.disabled) {
      this.renderer.setAttribute(chip, 'aria-disabled', 'true');
    }

    // Add role for better screen reader support
    this.renderer.setAttribute(chip, 'role', 'button');

    if (this.selected) {
      this.renderer.setAttribute(chip, 'aria-pressed', 'true');
    }
  }

  onClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit({ value: this.value, event });
  }

  onRemove(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.stopPropagation(); // Prevent chip click when removing
    this.remove.emit({ value: this.value, event });
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click.emit({ value: this.value, event: event as any });
    }

    if (
      this.removable &&
      (event.key === 'Delete' || event.key === 'Backspace')
    ) {
      event.preventDefault();
      this.remove.emit({ value: this.value, event: event as any });
    }
  }

  onRemoveKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onRemove(event as any);
    }
  }

  get chipClasses(): string {
    const classes = [
      'spade-chip',
      `spade-chip--${this.variant}`,
      `spade-chip--${this.size}`,
    ];

    if (this.disabled) classes.push('spade-chip--disabled');
    if (this.selected) classes.push('spade-chip--selected');
    if (this.removable) classes.push('spade-chip--removable');

    return classes.join(' ');
  }
}
