import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SpadeButtonComponent } from '../lib/components/button/button.component';
import { AccessibilityTestHelper } from './accessibility-test.helper';

// Test wrapper component to provide content
@Component({
  template: `
    <spade-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [ariaLabel]="ariaLabel"
    >
      {{ buttonText }}
    </spade-button>
  `,
  standalone: true,
  imports: [SpadeButtonComponent],
})
class TestButtonWrapperComponent {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  size: 'sm' | 'md' | 'lg' = 'md';
  disabled = false;
  loading = false;
  ariaLabel?: string;
  buttonText = 'Test Button';
}

describe('SpadeButton Accessibility', () => {
  let component: TestButtonWrapperComponent;
  let fixture: ComponentFixture<TestButtonWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestButtonWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should pass WCAG 2.1 AA standards', async () => {
    // Test default button with text content
    component.buttonText = 'Click me';
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Default',
      false // Don't log details in normal tests
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    expect(result.violationCount).toBe(0);

    if (result.violations.length > 0) {
      console.log('Button violations:', result.violations);
    }
  });

  it('should maintain accessibility with different variants', async () => {
    const variants: Array<'primary' | 'secondary' | 'ghost' | 'danger'> = [
      'primary',
      'secondary',
      'ghost',
      'danger',
    ];

    for (const variant of variants) {
      component.variant = variant;
      component.buttonText = `${variant} button`;
      fixture.detectChanges();

      const result = await AccessibilityTestHelper.runAxeTest(
        fixture,
        `Button-${variant}`,
        false
      );

      expect(result.wcagScore).toBeGreaterThanOrEqual(95);
      expect(result.violationCount).toBe(0);
    }
  });

  it('should be accessible in disabled state', async () => {
    component.disabled = true;
    component.buttonText = 'Disabled button';
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Disabled',
      false
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    expect(result.violationCount).toBe(0);
  });

  it('should be accessible in loading state', async () => {
    component.loading = true;
    component.buttonText = 'Loading button';
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Loading',
      false
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    expect(result.violationCount).toBe(0);
  });

  it('should work with aria-label instead of text content', async () => {
    component.buttonText = ''; // No visible text
    component.ariaLabel = 'Submit form';
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-AriaLabel',
      false
    );

    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    expect(result.violationCount).toBe(0);
  });
});
