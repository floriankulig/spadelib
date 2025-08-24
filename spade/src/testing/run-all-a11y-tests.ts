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

  // Generate summary statistics
  const summary = AccessibilityTestHelper.generateSummaryStats(results);

  console.log('====================================');
  console.log('SPADE ACCESSIBILITY TEST RESULTS');
  console.log('====================================');
  console.log(`Average WCAG Score: ${summary.averageWcagScore}%`);
  console.log(`Total Violations: ${summary.totalViolations}`);
  console.log('\nViolations by Impact:');
  console.log(`  Critical: ${summary.violationsByImpact.critical}`);
  console.log(`  Serious: ${summary.violationsByImpact.serious}`);
  console.log(`  Moderate: ${summary.violationsByImpact.moderate}`);
  console.log(`  Minor: ${summary.violationsByImpact.minor}`);
  console.log('\nComponent Scores:');
  summary.componentScores.forEach((cs: any) => {
    console.log(`  ${cs.name}: ${cs.score}% (${cs.violations} violations)`);
  });
  console.log('====================================');

  // Export for thesis
  const thesisData = {
    testDate: new Date().toISOString(),
    framework: 'Angular 20',
    library: 'Spade Component Library',
    wcagLevel: 'WCAG 2.1 AA',
    overallScore: summary.averageWcagScore,
    results: summary,
  };

  // Save to file for thesis documentation
  console.log('\nThesis Data (JSON):');
  console.log(JSON.stringify(thesisData, null, 2));
}
