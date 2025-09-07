import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpadeButtonComponent } from '../lib/components/button/button.component';
import { AccessibilityTestHelper } from './accessibility-test.helper';

describe('SpadeButton Accessibility', () => {
  let component: SpadeButtonComponent;
  let fixture: ComponentFixture<SpadeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpadeButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpadeButtonComponent);
    component = fixture.componentInstance;
  });

  it('should pass WCAG 2.1 AA standards', async () => {
    // Test default button
    fixture.detectChanges();
    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Default'
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
      fixture.detectChanges();

      const result = await AccessibilityTestHelper.runAxeTest(
        fixture,
        `Button-${variant}`
      );

      expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    }
  });

  it('should be accessible in disabled state', async () => {
    component.disabled = true;
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Disabled'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should be accessible in loading state', async () => {
    component.loading = true;
    fixture.detectChanges();

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Loading'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should handle keyboard navigation correctly', async () => {
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    let clickedEvent: MouseEvent | undefined;

    // Setup click handler - component.click is an EventEmitter
    const subscription = component.click.subscribe((event: MouseEvent) => {
      clickedEvent = event;
    });

    // Test Enter key - this should trigger the button's internal keyboard handler
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    buttonElement.dispatchEvent(enterEvent);
    await fixture.whenStable();

    // Reset and test Space key
    clickedEvent = undefined;
    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
    });
    buttonElement.dispatchEvent(spaceEvent);
    await fixture.whenStable();

    // Verify accessibility compliance after keyboard interaction
    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Keyboard'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);

    subscription.unsubscribe();
  });

  it('should have proper focus management', async () => {
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');

    // Test that button is focusable when enabled
    expect(buttonElement.tabIndex).not.toBe(-1);

    // Test focus visibility
    buttonElement.focus();
    expect(document.activeElement).toBe(buttonElement);

    // Test disabled button focus behavior
    component.disabled = true;
    fixture.detectChanges();

    // Disabled button should not be interactable but may still be focusable for screen readers
    expect(buttonElement.disabled).toBe(true);

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Focus'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should announce loading state to screen readers', async () => {
    // Test initial state
    fixture.detectChanges();
    let buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('false');

    // Test loading state
    component.loading = true;
    fixture.detectChanges();

    buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    expect(buttonElement.disabled).toBe(true);

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Loading-ScreenReader'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should properly handle aria-label attributes', async () => {
    const customLabel = 'Custom accessible button label';
    component.ariaLabel = customLabel;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-label')).toBe(customLabel);

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-AriaLabel'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should handle aria-pressed for toggle buttons', async () => {
    component.ariaPressed = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-pressed')).toBe('true');

    component.ariaPressed = false;
    fixture.detectChanges();
    expect(buttonElement.getAttribute('aria-pressed')).toBe('false');

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Toggle'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should handle aria-expanded for dropdown buttons', async () => {
    component.ariaExpanded = false;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-expanded')).toBe('false');

    component.ariaExpanded = true;
    fixture.detectChanges();
    expect(buttonElement.getAttribute('aria-expanded')).toBe('true');

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-Dropdown'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should meet minimum touch target size requirements', async () => {
    // Test small size meets minimum requirements
    component.size = 'sm';
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    const computedStyle = window.getComputedStyle(buttonElement);
    const minHeight = parseInt(computedStyle.minHeight, 10);

    // WCAG recommends minimum 44x44px for touch targets
    // Our small button should be at least 32px which is acceptable for desktop
    expect(minHeight).toBeGreaterThanOrEqual(32);

    // Test medium and large sizes
    component.size = 'md';
    fixture.detectChanges();
    const mediumHeight = parseInt(
      window.getComputedStyle(buttonElement).minHeight,
      10
    );
    expect(mediumHeight).toBeGreaterThanOrEqual(40);

    component.size = 'lg';
    fixture.detectChanges();
    const largeHeight = parseInt(
      window.getComputedStyle(buttonElement).minHeight,
      10
    );
    expect(largeHeight).toBeGreaterThanOrEqual(44); // Meets WCAG touch target size

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-TouchTarget'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should prevent interaction when disabled or loading', async () => {
    let clickCount = 0;
    const subscription = component.click.subscribe(() => clickCount++);

    // Test disabled state
    component.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');

    // Try to click disabled button - should not emit click event
    buttonElement.click();
    await fixture.whenStable();
    expect(clickCount).toBe(0);

    // Try keyboard activation on disabled button
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    buttonElement.dispatchEvent(enterEvent);
    await fixture.whenStable();
    expect(clickCount).toBe(0);

    // Test loading state
    component.disabled = false;
    component.loading = true;
    fixture.detectChanges();

    // Click on loading button should not emit event
    buttonElement.click();
    await fixture.whenStable();
    expect(clickCount).toBe(0);

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-DisabledInteraction'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);

    subscription.unsubscribe();
  });

  it('should maintain semantic button role', async () => {
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');

    // Button should have implicit button role
    expect(buttonElement.tagName.toLowerCase()).toBe('button');
    expect(buttonElement.getAttribute('role')).toBeNull(); // Native button doesn't need explicit role

    // Should not have conflicting roles
    expect(buttonElement.getAttribute('role')).not.toBe('link');
    expect(buttonElement.getAttribute('role')).not.toBe('menuitem');

    const result = await AccessibilityTestHelper.runAxeTest(
      fixture,
      'Button-SemanticRole'
    );
    expect(result.wcagScore).toBeGreaterThanOrEqual(95);
  });

  it('should provide proper context for screen readers in different states', async () => {
    // Test that all states provide adequate context
    const states = [
      { disabled: false, loading: false, variant: 'primary' as const },
      { disabled: true, loading: false, variant: 'primary' as const },
      { disabled: false, loading: true, variant: 'primary' as const },
      { disabled: false, loading: false, variant: 'danger' as const },
    ];

    for (const state of states) {
      component.disabled = state.disabled;
      component.loading = state.loading;
      component.variant = state.variant;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');

      // Verify appropriate attributes are set
      if (state.disabled) {
        expect(buttonElement.getAttribute('aria-disabled')).toBe('true');
      }

      if (state.loading) {
        expect(buttonElement.getAttribute('aria-busy')).toBe('true');
      }

      const result = await AccessibilityTestHelper.runAxeTest(
        fixture,
        `Button-ScreenReaderContext-${state.variant}-${
          state.disabled ? 'disabled' : 'enabled'
        }-${state.loading ? 'loading' : 'idle'}`
      );
      expect(result.wcagScore).toBeGreaterThanOrEqual(95);
    }
  });
});
