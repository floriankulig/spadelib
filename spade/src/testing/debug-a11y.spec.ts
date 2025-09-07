import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SpadeButtonComponent } from '../lib/components/button/button.component';
import { AccessibilityTestHelper } from './accessibility-test.helper';

// Test wrapper component to provide content
@Component({
  template: `
    <spade-button
      [variant]="variant"
      [disabled]="disabled"
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
  disabled = false;
  ariaLabel?: string;
  buttonText = 'Test Button';
}

describe('A11y Debug Suite', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestButtonWrapperComponent],
    }).compileComponents();
  });

  it('DEBUG: Button with text content', async () => {
    const fixture: ComponentFixture<TestButtonWrapperComponent> =
      TestBed.createComponent(TestButtonWrapperComponent);
    fixture.componentInstance.buttonText = 'Click me';
    fixture.detectChanges();

    await AccessibilityTestHelper.quickTest(fixture, 'Button-WithText');
    expect(true).toBe(true);
  });

  it('DEBUG: Button with aria-label only', async () => {
    const fixture: ComponentFixture<TestButtonWrapperComponent> =
      TestBed.createComponent(TestButtonWrapperComponent);
    fixture.componentInstance.buttonText = ''; // No text
    fixture.componentInstance.ariaLabel = 'Submit form';
    fixture.detectChanges();

    await AccessibilityTestHelper.quickTest(fixture, 'Button-AriaLabelOnly');
    expect(true).toBe(true);
  });

  it('DEBUG: Empty button (should fail)', async () => {
    const fixture: ComponentFixture<TestButtonWrapperComponent> =
      TestBed.createComponent(TestButtonWrapperComponent);
    fixture.componentInstance.buttonText = ''; // No text
    fixture.componentInstance.ariaLabel = undefined; // No aria-label
    fixture.detectChanges();

    await AccessibilityTestHelper.quickTest(fixture, 'Button-Empty-ShouldFail');
    expect(true).toBe(true);
  });

  it('DEBUG: Disabled button with text', async () => {
    const fixture: ComponentFixture<TestButtonWrapperComponent> =
      TestBed.createComponent(TestButtonWrapperComponent);
    fixture.componentInstance.buttonText = 'Disabled Button';
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    await AccessibilityTestHelper.quickTest(fixture, 'Button-DisabledWithText');
    expect(true).toBe(true);
  });
});
