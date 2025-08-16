import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownOption } from './dropdown';

@Component({
  selector: 'spade-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpadeDropdownComponent),
      multi: true,
    },
  ],
})
export class SpadeDropdownComponent implements ControlValueAccessor, OnInit {
  @Input() options: DropdownOption[] = [];
  @Input() label?: string;
  @Input() placeholder = 'Select an option';
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() maxHeight = '300px';
  @Input() dropdownId?: string;
  @Input() ariaLabel?: string;

  @Output() change = new EventEmitter<any>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') triggerElement!: ElementRef<HTMLButtonElement>;
  @ViewChild('dropdownPanel') dropdownPanelElement!: ElementRef<HTMLDivElement>;

  isOpen = false;
  selectedValues: any[] = [];
  focusedIndex = -1;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    if (!this.dropdownId) {
      this.dropdownId = `spade-dropdown-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  }

  writeValue(value: any): void {
    if (this.multiple) {
      this.selectedValues = Array.isArray(value) ? value : [];
    } else {
      this.selectedValues =
        value !== null && value !== undefined ? [value] : [];
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      !(
        this.triggerElement.nativeElement.contains(event.target as Node) ||
        this.dropdownPanelElement.nativeElement.contains(event.target as Node)
      )
    ) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      !this.isOpen &&
      (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      this.open();
      return;
    }

    if (this.isOpen) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          this.close();
          this.triggerElement.nativeElement.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.focusNext();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.focusPrevious();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (this.focusedIndex >= 0) {
            const option = this.filteredOptions[this.focusedIndex];
            if (option && !option.disabled) {
              this.selectOption(option);
            }
          }
          break;
        case 'Tab':
          this.close();
          break;
      }
    }
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled || this.isOpen) return;

    this.isOpen = true;
    this.focusedIndex = -1;
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.focusedIndex = -1;
    this.onTouched();
    this.closed.emit();
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      const index = this.selectedValues.indexOf(option.value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(option.value);
      }
      this.onChange([...this.selectedValues]);
      this.change.emit([...this.selectedValues]);
    } else {
      this.selectedValues = [option.value];
      this.onChange(option.value);
      this.change.emit(option.value);
      this.close();
    }
  }

  private focusNext(): void {
    const options = this.filteredOptions.filter((o) => !o.disabled);
    if (options.length === 0) return;

    this.focusedIndex++;
    if (this.focusedIndex >= this.filteredOptions.length) {
      this.focusedIndex = 0;
    }

    while (this.filteredOptions[this.focusedIndex]?.disabled) {
      this.focusedIndex++;
      if (this.focusedIndex >= this.filteredOptions.length) {
        this.focusedIndex = 0;
      }
    }
  }

  private focusPrevious(): void {
    const options = this.filteredOptions.filter((o) => !o.disabled);
    if (options.length === 0) return;

    this.focusedIndex--;
    if (this.focusedIndex < 0) {
      this.focusedIndex = this.filteredOptions.length - 1;
    }

    while (this.filteredOptions[this.focusedIndex]?.disabled) {
      this.focusedIndex--;
      if (this.focusedIndex < 0) {
        this.focusedIndex = this.filteredOptions.length - 1;
      }
    }
  }

  get filteredOptions(): DropdownOption[] {
    return this.options;
  }

  get displayValue(): string {
    if (this.selectedValues.length === 0) {
      return '';
    }

    if (this.multiple) {
      const selectedLabels = this.selectedValues
        .map((value) => {
          const option = this.options.find((o) => o.value === value);
          return option ? option.label : '';
        })
        .filter((label) => label);
      return selectedLabels.join(', ');
    }

    const selected = this.options.find(
      (o) => o.value === this.selectedValues[0]
    );
    return selected ? selected.label : '';
  }

  get selectedOptions(): DropdownOption[] {
    return this.options.filter((o) => this.selectedValues.includes(o.value));
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedValues.includes(option.value);
  }

  isFocused(index: number): boolean {
    return this.focusedIndex === index;
  }
}
