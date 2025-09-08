import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpadeInputComponent } from '../lib/components/input/input.component';
import {
  AccessibilityTestHelper,
  MIN_WCAG_SCORE,
} from './accessibility-test.helper';

describe('SpadeInput Accessibility', () => {
  let component: SpadeInputComponent;
  let fixture: ComponentFixture<SpadeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpadeInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpadeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass WCAG 2.1 AA standards with a label', async () => {
    component.label = 'Test Input';
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Input-Default'
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
    expect(result.violationCount).toBe(0);

    if (result.violations.length > 0) {
      console.log('Input violations:', result.violations);
    }
  });

  it('should be accessible in disabled state', async () => {
    component.label = 'Disabled Input';
    component.disabled = true;
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Input-Disabled'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });

  it('should have a proper label association', async () => {
    component.label = 'My Input';
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    const labelElement = fixture.nativeElement.querySelector('label');

    expect(inputElement.id).toBeTruthy();
    expect(labelElement.getAttribute('for')).toBe(inputElement.id);
  });

  it('should handle aria-invalid attribute correctly for errors', async () => {
    component.label = 'Error Input';
    component.error = 'This field is required';
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('aria-invalid')).toBe('true');

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Input-Error'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(MIN_WCAG_SCORE);
  });
});
