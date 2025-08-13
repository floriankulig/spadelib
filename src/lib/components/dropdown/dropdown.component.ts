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
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { DropdownOption } from './dropdown';

@Component({
  selector: 'spade-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  @Input() searchable = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() maxHeight = '300px';
  @Input() dropdownId?: string;
  @Input() ariaLabel?: string;

  @Output() spadeChange = new EventEmitter<any>();
  @Output() spadeOpen = new EventEmitter<void>();
  @Output() spadeClose = new EventEmitter<void>();
  @Output() spadeSearch = new EventEmitter<string>();

  @ViewChild('trigger') triggerElement!: ElementRef<HTMLButtonElement>;
  @ViewChild('dropdownPanel') dropdownPanelElement!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInputElement?: ElementRef<HTMLInputElement>;

  isOpen = false;
  searchTerm = '';
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
    this.spadeOpen.emit();

    // Focus search input if searchable
    setTimeout(() => {
      if (this.searchable && this.searchInputElement) {
        this.searchInputElement.nativeElement.focus();
      }
    });
  }

  close(): void {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.searchTerm = '';
    this.focusedIndex = -1;
    this.onTouched();
    this.spadeClose.emit();
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
      this.spadeChange.emit([...this.selectedValues]);
    } else {
      this.selectedValues = [option.value];
      this.onChange(option.value);
      this.spadeChange.emit(option.value);
      this.close();
    }
  }

  removeOption(value: any, event: MouseEvent): void {
    event.stopPropagation();
    const index = this.selectedValues.indexOf(value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
      if (this.multiple) {
        this.onChange([...this.selectedValues]);
        this.spadeChange.emit([...this.selectedValues]);
      } else {
        this.onChange(null);
        this.spadeChange.emit(null);
      }
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.focusedIndex = -1;
    this.spadeSearch.emit(term);
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
    if (!this.searchable || !this.searchTerm) {
      return this.options;
    }

    const term = this.searchTerm.toLowerCase();
    return this.options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.description?.toLowerCase().includes(term)
    );
  }

  get displayValue(): string {
    if (this.selectedValues.length === 0) {
      return '';
    }

    if (this.multiple) {
      return `${this.selectedValues.length} selected`;
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

  getOptionLabel(value: any): string {
    const option = this.options.find((o) => o.value === value);
    return option ? option.label : '';
  }
}
