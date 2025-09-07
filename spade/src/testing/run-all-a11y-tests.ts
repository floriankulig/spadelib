import { TestBed } from '@angular/core/testing';
import { SpadeButtonComponent } from '../lib/components/button/button.component';
import { SpadeChipComponent } from '../lib/components/chip/chip.component';
import { SpadeDropdownComponent } from '../lib/components/dropdown/dropdown.component';
import { SpadeInputComponent } from '../lib/components/input/input.component';
import {
  A11yTestResult,
  AccessibilityTestHelper,
} from './accessibility-test.helper';

/**
 * Run all accessibility tests and generate report for thesis
 */
export async function runCompleteAccessibilitySuite(): Promise<void> {
  const results: A11yTestResult[] = [];

  // Test Button Component
  const buttonFixture = TestBed.createComponent(SpadeButtonComponent);
  buttonFixture.detectChanges();
  results.push(
    await AccessibilityTestHelper.runAxeTest(buttonFixture, 'Button')
  );

  // Test Input Component
  const inputFixture = TestBed.createComponent(SpadeInputComponent);
  inputFixture.componentInstance.label = 'Test Input';
  inputFixture.detectChanges();
  results.push(await AccessibilityTestHelper.runAxeTest(inputFixture, 'Input'));

  // Test Dropdown Component
  const dropdownFixture = TestBed.createComponent(SpadeDropdownComponent);
  dropdownFixture.componentInstance.label = 'Test Dropdown';
  dropdownFixture.componentInstance.options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  dropdownFixture.detectChanges();
  results.push(
    await AccessibilityTestHelper.runAxeTest(dropdownFixture, 'Dropdown')
  );

  // Test Chip Component
  const chipFixture = TestBed.createComponent(SpadeChipComponent);
  chipFixture.detectChanges();
  results.push(await AccessibilityTestHelper.runAxeTest(chipFixture, 'Chip'));

  // Generate summary statistics (now with clean single log output)
  const summary = AccessibilityTestHelper.generateSummaryStats(results);

  // Export for thesis with single JSON log
  const thesisData = {
    testDate: new Date().toISOString(),
    framework: 'Angular 20',
    library: 'Spade Component Library',
    wcagLevel: 'WCAG 2.1 AA',
    overallScore: summary.averageWcagScore,
    results: summary,
  };

  console.log('\n📋 Thesis Data:');
  console.log(JSON.stringify(thesisData, null, 2));
}
