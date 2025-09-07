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
  selector: 'spade-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class SpadeButtonComponent implements OnInit {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;
  @Input() ariaPressed?: boolean;
  @Input() ariaExpanded?: boolean;

  @Output() click = new EventEmitter<MouseEvent>();

  @HostBinding('class.spade-button-host') hostClass = true;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupAccessibility();
  }

  private setupAccessibility() {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (!button) return;

    // Ensure button is keyboard accessible
    if (this.disabled) {
      this.renderer.setAttribute(button, 'aria-disabled', 'true');
    }

    // Add loading state announcement
    if (this.loading) {
      this.renderer.setAttribute(button, 'aria-busy', 'true');
    }
  }

  onClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit(event);
  }

  get buttonClasses(): string {
    const classes = [
      'spade-button',
      `spade-button--${this.variant}`,
      `spade-button--${this.size}`,
    ];

    if (this.fullWidth) classes.push('spade-button--full-width');
    if (this.loading) classes.push('spade-button--loading');
    if (this.disabled) classes.push('spade-button--disabled');

    return classes.join(' ');
  }

  get buttonAriaLabel(): string {
    if (this.loading) {
      return this.ariaLabel || 'Loading...';
    }
    return this.ariaLabel || '';
  }
}
