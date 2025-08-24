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
});
