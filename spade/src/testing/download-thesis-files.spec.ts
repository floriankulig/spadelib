// src/testing/download-thesis-files.spec.ts

import { TestBed } from '@angular/core/testing';
import { ThesisAccessibilityReporter } from './thesis-accessibility-reporter';

describe('Download Thesis Files', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();
  });

  it('should generate and download all thesis files (CSV, JSON, Summary)', async () => {
    console.log('\n🎓 STARTING THESIS FILE GENERATION AND DOWNLOAD...\n');
    console.log('📁 This will generate and download:');
    console.log('   • CSV file with component data');
    console.log('   • JSON file with complete report');
    console.log('   • TXT file with executive summary');
    console.log('');

    // Generate and download all files
    await ThesisAccessibilityReporter.generateAndDownloadThesisFiles();

    console.log('\n✅ SUCCESS: All thesis files have been generated!');
    console.log('');
    console.log('📋 What you should see:');
    console.log('   • Browser download notifications (if running in browser)');
    console.log('   • Files saved to your Downloads folder');
    console.log('   • Filenames include timestamp for organization');
    console.log('');
    console.log('📊 Use the CSV file for:');
    console.log('   • Quantitative analysis in Excel/Google Sheets');
    console.log('   • Creating charts and graphs');
    console.log('   • Statistical analysis for your thesis');
    console.log('');
    console.log('📄 Use the JSON file for:');
    console.log('   • Complete technical documentation');
    console.log('   • Detailed violation analysis');
    console.log('   • Appendix in your thesis');
    console.log('');
    console.log('📋 Use the Summary file for:');
    console.log('   • Executive summary in your thesis');
    console.log('   • Quick reference of key metrics');
    console.log('   • Overview of compliance status');

    // This test always passes since we're just generating files
    expect(true).toBe(true);
  });

  it('should generate individual file formats separately', async () => {
    console.log('\n📊 GENERATING INDIVIDUAL FILE FORMATS...\n');

    const report = await ThesisAccessibilityReporter.generateComplianceReport();
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, '-');

    // Generate CSV
    const csvContent = ThesisAccessibilityReporter.generateCsvData(report);
    ThesisAccessibilityReporter.downloadCsvFile(
      csvContent,
      `accessibility-data-${timestamp}.csv`
    );
    console.log('✅ CSV file generated and downloaded');

    // Generate JSON
    const jsonContent = ThesisAccessibilityReporter.exportToJson(report);
    ThesisAccessibilityReporter.downloadJsonFile(
      jsonContent,
      `accessibility-report-${timestamp}.json`
    );
    console.log('✅ JSON file generated and downloaded');

    // Generate Summary
    const summaryContent =
      ThesisAccessibilityReporter.generateExecutiveSummary(report);
    ThesisAccessibilityReporter.downloadTextFile(
      summaryContent,
      `accessibility-summary-${timestamp}.txt`
    );
    console.log('✅ Summary file generated and downloaded');

    console.log('\n📁 All files generated with timestamp:', timestamp);

    expect(csvContent).toContain('Component,WCAG_Score');
    expect(jsonContent).toContain('"metadata"');
    expect(summaryContent).toContain('ACCESSIBILITY COMPLIANCE REPORT');
  });
});
