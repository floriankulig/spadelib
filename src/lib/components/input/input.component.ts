import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'spade-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpadeInputComponent),
      multi: true,
    },
  ],
})
export class SpadeInputComponent implements ControlValueAccessor, OnInit {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' =
    'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() showCharacterCount = false;
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() autocomplete?: string;

  @Output() input = new EventEmitter<string>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  value = '';
  focused = false;
  private _maxLength?: number;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    if (!this.inputId) {
      this.inputId = `spade-input-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  @Input()
  get maxLength(): number | null {
    return this._maxLength ?? null;
  }

  set maxLength(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
      this._maxLength = undefined;
    } else {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      this._maxLength = isNaN(numValue) ? undefined : numValue;
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.input.emit(value);
  }

  onInputFocus(event: FocusEvent): void {
    this.focused = true;
    this.focus.emit(event);
  }

  onInputBlur(event: FocusEvent): void {
    this.focused = false;
    this.onTouched();
    this.blur.emit(event);
  }

  get inputClasses(): string {
    const classes = ['spade-input__field', `spade-input__field--${this.size}`];

    if (this.error) classes.push('spade-input__field--error');
    if (this.disabled) classes.push('spade-input__field--disabled');
    if (this.readonly) classes.push('spade-input__field--readonly');

    return classes.join(' ');
  }

  get characterCount(): string {
    const length = this.value ? this.value.length : 0;
    return this.maxLength ? `${length}/${this.maxLength}` : `${length}`;
  }

  get characterCountClass(): string {
    if (!this.maxLength) return '';
    const length = this.value ? this.value.length : 0;
    const percentage = (length / this.maxLength) * 100;

    if (percentage >= 100) return 'spade-input__char-count--error';
    if (percentage >= 90) return 'spade-input__char-count--warning';
    return '';
  }

  get ariaDescribedByIds(): string {
    const ids = [];
    if (this.ariaDescribedBy) ids.push(this.ariaDescribedBy);
    if (this.error) ids.push(`${this.inputId}-error`);
    if (this.hint) ids.push(`${this.inputId}-hint`);
    if (this.showCharacterCount) ids.push(`${this.inputId}-count`);
    return ids.join(' ');
  }
}
