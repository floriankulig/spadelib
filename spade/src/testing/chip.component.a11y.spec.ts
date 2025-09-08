import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpadeChipComponent } from '../lib/components/chip/chip.component';
import {
  AccessibilityTestHelper,
  MIN_WCAG_SCORE,
} from './accessibility-test.helper';

describe('SpadeChip Accessibility', () => {
  let component: SpadeChipComponent;
  let fixture: ComponentFixture<SpadeChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpadeChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpadeChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass WCAG 2.1 AA standards', async () => {
    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Chip-Default'
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
    expect(result.violationCount).toBe(0);

    if (result.violations.length > 0) {
      console.log('Chip violations:', result.violations);
    }
  });

  it('should be accessible in disabled state', async () => {
    component.disabled = true;
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Chip-Disabled'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });

  it('should have proper focus management', async () => {
    const chipElement = fixture.nativeElement.querySelector('.spade-chip');

    // Test that chip is focusable when enabled
    expect(chipElement.tabIndex).toBe(0);

    // Test focus visibility
    chipElement.focus();
    expect(document.activeElement).toBe(chipElement);

    // Test disabled chip focus behavior
    component.disabled = true;
    fixture.detectChanges();

    expect(chipElement.tabIndex).toBe(-1);

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Chip-Focus'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });
});
