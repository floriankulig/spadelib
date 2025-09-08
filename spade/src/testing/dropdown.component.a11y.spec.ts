import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpadeDropdownComponent } from '../lib/components/dropdown/dropdown.component';
import {
  AccessibilityTestHelper,
  MIN_WCAG_SCORE,
} from './accessibility-test.helper';

describe('SpadeDropdown Accessibility', () => {
  let component: SpadeDropdownComponent;
  let fixture: ComponentFixture<SpadeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpadeDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpadeDropdownComponent);
    component = fixture.componentInstance;
    component.options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ];
    fixture.detectChanges();
  });

  it('should pass WCAG 2.1 AA standards', async () => {
    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Dropdown-Default'
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
    expect(result.violationCount).toBe(0);

    if (result.violations.length > 0) {
      console.log('Dropdown violations:', result.violations);
    }
  });

  it('should be accessible when open', async () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Dropdown-Open'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });

  it('should handle aria-expanded attribute correctly', async () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-expanded')).toBe('false');

    buttonElement.click();
    fixture.detectChanges();
    expect(buttonElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should be accessible in disabled state', async () => {
    component.disabled = true;
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Dropdown-Disabled'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });
});
