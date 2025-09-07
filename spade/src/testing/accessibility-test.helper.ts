import { ComponentFixture } from '@angular/core/testing';
import axe, { AxeResults } from 'axe-core';

export const MIN_WCAG_SCORE = 95;

export interface A11yTestResult {
  componentName: string;
  wcagScore: number;
  violationCount: number;
  violations: ViolationSummary[];
  passCount: number;
  timestamp: Date;
}

export interface ViolationSummary {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string;
  nodeCount: number;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export class AccessibilityTestHelper {
  /**
   * Run axe-core accessibility test on a component with optional verbose logging
   */
  static async runAxeTest(
    fixture: ComponentFixture<any>,
    componentName: string,
    verbose = false
  ): Promise<A11yTestResult> {
    const element = fixture.nativeElement;

    const results: AxeResults = await axe.run(element, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
    });

    const totalChecks = results.passes.length + results.violations.length;
    const wcagScore =
      totalChecks > 0
        ? Math.round((results.passes.length / totalChecks) * 100)
        : 100;

    const violations: ViolationSummary[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as any,
      description: v.description,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target as string[],
        failureSummary: n.failureSummary || '',
      })),
    }));

    const result: A11yTestResult = {
      componentName,
      wcagScore,
      violationCount: results.violations.length,
      violations,
      passCount: results.passes.length,
      timestamp: new Date(),
    };

    // Only log if verbose or if there are violations
    if (verbose || result.violations.length > 0) {
      this.logTestResult(result);
    }

    return result;
  }

  /**
   * Generate consolidated log output instead of multiple console.log calls
   */
  private static logTestResult(result: A11yTestResult): void {
    const logLines = [
      `🔍 ACCESSIBILITY TEST: ${result.componentName}`,
      `📊 WCAG Score: ${result.wcagScore}%`,
      `✅ Passed checks: ${result.passCount}`,
      `❌ Violations: ${result.violationCount}`,
    ];

    if (result.violations.length > 0) {
      logLines.push('', '🚨 VIOLATIONS FOUND:');
      result.violations.forEach((violation, index) => {
        logLines.push(
          '',
          `${index + 1}. ${violation.id} (${violation.impact?.toUpperCase()})`,
          `   Description: ${violation.description}`,
          `   Affected nodes: ${violation.nodeCount}`,
          `   Help: ${violation.helpUrl}`
        );
      });
    }

    // Single console.log call with joined lines
    console.log(logLines.join('\n'));
  }

  /**
   * Generate summary with single log output
   */
  static generateSummaryStats(results: A11yTestResult[]): any {
    const avgScore =
      results.reduce((sum, r) => sum + r.wcagScore, 0) / results.length;
    const totalViolations = results.reduce(
      (sum, r) => sum + r.violationCount,
      0
    );

    const impactCounts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    results.forEach((r) => {
      r.violations.forEach((v) => {
        if (v.impact in impactCounts) {
          impactCounts[v.impact]++;
        }
      });
    });

    const summary = {
      averageWcagScore: Math.round(avgScore),
      totalViolations,
      violationsByImpact: impactCounts,
      componentScores: results.map((r) => ({
        name: r.componentName,
        score: r.wcagScore,
        violations: r.violationCount,
      })),
    };

    // Single consolidated log for summary
    const summaryLines = [
      '====================================',
      'SPADE ACCESSIBILITY TEST RESULTS',
      '====================================',
      `Average WCAG Score: ${summary.averageWcagScore}%`,
      `Total Violations: ${summary.totalViolations}`,
      '',
      'Violations by Impact:',
      `  Critical: ${summary.violationsByImpact.critical}`,
      `  Serious: ${summary.violationsByImpact.serious}`,
      `  Moderate: ${summary.violationsByImpact.moderate}`,
      `  Minor: ${summary.violationsByImpact.minor}`,
      '',
      'Component Scores:',
      ...summary.componentScores.map(
        (cs: any) => `  ${cs.name}: ${cs.score}% (${cs.violations} violations)`
      ),
      '====================================',
    ];

    console.log(summaryLines.join('\n'));

    return summary;
  }

  /**
   * Run quick test with immediate console output
   */
  static async quickTest(
    fixture: ComponentFixture<any>,
    componentName: string
  ): Promise<void> {
    console.log(`\n🧪 Running quick A11y test for ${componentName}...`);
    const result = await this.runAxeTest(fixture, componentName, true);

    if (result.wcagScore < 95) {
      console.log(`\n💡 QUICK FIXES NEEDED for ${componentName}:`);
      result.violations.forEach((v) => {
        console.log(`   - Fix ${v.id}: ${v.description.substring(0, 80)}...`);
      });
    } else {
      console.log(`\n✅ ${componentName} passed quick accessibility test!`);
    }
  }
}
