import { ComponentFixture } from '@angular/core/testing';
import axe, { AxeResults } from 'axe-core';

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
}

export class AccessibilityTestHelper {
  /**
   * Run axe-core accessibility test on a component
   */
  static async runAxeTest(
    fixture: ComponentFixture<any>,
    componentName: string
  ): Promise<A11yTestResult> {
    const element = fixture.nativeElement;

    // Configure axe to test for WCAG 2.1 AA
    const results: AxeResults = await axe.run(element, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
    });

    // Calculate WCAG compliance score
    const totalChecks = results.passes.length + results.violations.length;
    const wcagScore =
      totalChecks > 0
        ? Math.round((results.passes.length / totalChecks) * 100)
        : 100;

    // Map violations to summary
    const violations: ViolationSummary[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as any,
      description: v.description,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
    }));

    return {
      componentName,
      wcagScore,
      violationCount: results.violations.length,
      violations,
      passCount: results.passes.length,
      timestamp: new Date(),
    };
  }

  /**
   * Generate summary statistics for thesis
   */
  static generateSummaryStats(results: A11yTestResult[]): any {
    const avgScore =
      results.reduce((sum, r) => sum + r.wcagScore, 0) / results.length;
    const totalViolations = results.reduce(
      (sum, r) => sum + r.violationCount,
      0
    );

    // Group violations by impact
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

    return {
      averageWcagScore: Math.round(avgScore),
      totalViolations,
      violationsByImpact: impactCounts,
      componentScores: results.map((r) => ({
        name: r.componentName,
        score: r.wcagScore,
        violations: r.violationCount,
      })),
    };
  }
}
