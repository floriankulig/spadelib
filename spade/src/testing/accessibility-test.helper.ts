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
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export class AccessibilityTestHelper {
  /**
   * Run axe-core accessibility test on a component with detailed violation logging
   */
  static async runAxeTest(
    fixture: ComponentFixture<any>,
    componentName: string,
    logDetails = true
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

    // Map violations to detailed summary
    const violations: ViolationSummary[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as any,
      description: v.description,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
      nodes: v.nodes.map((node) => ({
        html: node.html,
        target: node.target as string[],
        failureSummary: node.failureSummary || 'No failure summary available',
      })),
    }));

    const testResult = {
      componentName,
      wcagScore,
      violationCount: results.violations.length,
      violations,
      passCount: results.passes.length,
      timestamp: new Date(),
    };

    // Log detailed results if requested
    if (logDetails) {
      this.logDetailedResults(testResult);
    }

    return testResult;
  }

  /**
   * Log detailed accessibility test results to console
   */
  static logDetailedResults(result: A11yTestResult): void {
    console.log('\n' + '='.repeat(60));
    console.log(`🔍 ACCESSIBILITY TEST: ${result.componentName}`);
    console.log('='.repeat(60));
    console.log(`📊 WCAG Score: ${result.wcagScore}%`);
    console.log(`✅ Passed checks: ${result.passCount}`);
    console.log(`❌ Violations: ${result.violationCount}`);
    console.log(`⏰ Tested at: ${result.timestamp.toLocaleString()}`);

    if (result.violations.length > 0) {
      console.log('\n🚨 VIOLATIONS FOUND:');
      console.log('-'.repeat(40));

      result.violations.forEach((violation, index) => {
        console.log(
          `\n${index + 1}. ${violation.id} (${violation.impact.toUpperCase()})`
        );
        console.log(`   Description: ${violation.description}`);
        console.log(`   Affected nodes: ${violation.nodeCount}`);
        console.log(`   Help: ${violation.helpUrl}`);

        // Show first few affected elements
        violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
          console.log(`   
   📍 Element ${nodeIndex + 1}:`);
          console.log(`      Target: ${node.target.join(' > ')}`);
          console.log(
            `      HTML: ${node.html.substring(0, 100)}${
              node.html.length > 100 ? '...' : ''
            }`
          );
          console.log(`      Issue: ${node.failureSummary}`);
        });

        if (violation.nodes.length > 3) {
          console.log(`   ... and ${violation.nodes.length - 3} more elements`);
        }
      });
    } else {
      console.log('\n🎉 No accessibility violations found!');
    }

    console.log('\n' + '='.repeat(60) + '\n');
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

    // Group violations by type
    const violationTypes: { [key: string]: number } = {};

    results.forEach((r) => {
      r.violations.forEach((v) => {
        if (v.impact in impactCounts) {
          impactCounts[v.impact]++;
        }
        violationTypes[v.id] = (violationTypes[v.id] || 0) + 1;
      });
    });

    return {
      averageWcagScore: Math.round(avgScore),
      totalViolations,
      violationsByImpact: impactCounts,
      violationsByType: violationTypes,
      componentScores: results.map((r) => ({
        name: r.componentName,
        score: r.wcagScore,
        violations: r.violationCount,
        topViolations: r.violations
          .sort((a, b) => {
            const impactOrder = {
              critical: 4,
              serious: 3,
              moderate: 2,
              minor: 1,
            };
            return impactOrder[b.impact] - impactOrder[a.impact];
          })
          .slice(0, 3)
          .map((v) => `${v.id} (${v.impact})`),
      })),
    };
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
    }
  }
}
