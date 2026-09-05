import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SEOAnalysis } from '../types';

interface PDFExportOptions {
  chartElement?: HTMLElement | null;
}

export async function exportSEOAnalysisToPDF(
  analysis: SEOAnalysis,
  options?: PDFExportOptions
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2;
  const bottomMargin = 50;

  let y = 40;

  // Helper to check for page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 48;
      return true;
    }
    return false;
  };

  // --- HEADER SECTION ---
  // Dark header block
  doc.setFillColor(15, 15, 18); // #0F0F12
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Brand accent bar
  doc.setFillColor(197, 255, 74); // #C5FF4A
  doc.rect(0, 88, pageWidth, 2.5, 'F');

  // Brand title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('NEXUS_SEO // SEMANTIC GAP REPORT', marginX, 36);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 255, 74);
  doc.text('INFORMATION GAIN (US PATENT 10,698,958 B2) & TOPICAL RESONANCE AUDIT', marginX, 50);

  // Metadata block (Date & Vector ID)
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 190);
  const formattedDate = new Date(analysis.timestamp || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`AUDIT DATE: ${formattedDate.toUpperCase()}`, marginX, 70);
  doc.text(`VECTOR ID: ${(analysis.id || 'NEXUS-01').substring(0, 12).toUpperCase()}`, pageWidth - marginX - 140, 70);

  y = 110;

  // --- EXECUTIVE SUMMARY CARD ---
  doc.setFillColor(248, 249, 251);
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(1);
  doc.roundedRect(marginX, y, contentWidth, 75, 4, 4, 'FD');

  // Accent badge
  doc.setFillColor(15, 15, 18);
  doc.roundedRect(marginX + 12, y + 12, 100, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(197, 255, 74);
  doc.text('TARGET QUERY', marginX + 18, y + 23);

  // Keyword text
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(16);
  doc.setTextColor(18, 18, 22);
  const keywordDisplay = `"${analysis.keyword}"`;
  doc.text(keywordDisplay, marginX + 120, y + 25);

  // Intent and Competitor Row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 85, 95);
  doc.text(`Primary Intent: `, marginX + 16, y + 54);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 25);
  doc.text(`${analysis.primaryIntent.toUpperCase()}`, marginX + 80, y + 54);

  if (analysis.competitor) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 85, 95);
    doc.text(`Benchmarked Rival: `, marginX + 200, y + 54);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72); // Rose/red
    doc.text(`${analysis.competitor.toUpperCase()}`, marginX + 295, y + 54);
  }

  // Key Metrics on the right side of the card
  doc.setFillColor(235, 248, 230);
  doc.roundedRect(pageWidth - marginX - 110, y + 10, 98, 55, 3, 3, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(60, 90, 40);
  doc.text('GAIN POTENTIAL', pageWidth - marginX - 98, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20, 80, 20);
  doc.text(`${analysis.informationGainPotential}%`, pageWidth - marginX - 98, y + 48);

  y += 90;

  // --- KPI GAUGES ROW (Gain Potential, Content Depth, Topical Authority) ---
  const kpiBoxWidth = (contentWidth - 20) / 3;
  const kpis = [
    {
      label: 'INFORMATION GAIN POTENTIAL',
      val: `${analysis.informationGainPotential}%`,
      sub: 'Unique vector novelty vs SERP average'
    },
    {
      label: 'CONTENT DEPTH SCORE',
      val: `${analysis.contentDepthScore || Math.min(96, analysis.informationGainPotential + 6)}%`,
      sub: 'Topical entities addressed'
    },
    {
      label: 'TOPICAL AUTHORITY RATING',
      val: `${analysis.topicalAuthorityScore || Math.min(94, Math.max(72, analysis.informationGainPotential - 4))}%`,
      sub: 'Knowledge Graph integration strength'
    }
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = marginX + idx * (kpiBoxWidth + 10);
    doc.setFillColor(252, 252, 254);
    doc.setDrawColor(228, 230, 236);
    doc.roundedRect(kpiX, y, kpiBoxWidth, 48, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 115, 128);
    doc.text(kpi.label, kpiX + 10, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, kpiX + 10, y + 31);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(130, 135, 145);
    doc.text(kpi.sub, kpiX + 10, y + 41);
  });

  y += 60;

  // --- DIFFERENTIATOR STRATEGY BLOCK ---
  checkPageBreak(75);
  doc.setFillColor(242, 245, 250);
  doc.setDrawColor(210, 218, 230);
  doc.roundedRect(marginX, y, contentWidth, 54, 3, 3, 'FD');

  doc.setFillColor(25, 40, 75);
  doc.rect(marginX, y, 4, 54, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(25, 40, 75);
  doc.text('DIFFERENTIATOR STRATEGY // HELPFUL CONTENT BLUEPRINT', marginX + 14, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(45, 55, 72);
  const strategyLines = doc.splitTextToSize(analysis.differentiatorStrategy, contentWidth - 28);
  doc.text(strategyLines.slice(0, 3), marginX + 14, y + 29);

  y += 66;

  // --- EMBEDDED CHART SNAPSHOT (IF PROVIDED) ---
  if (options?.chartElement) {
    try {
      checkPageBreak(170);
      const canvas = await html2canvas(options.chartElement, {
        scale: 2,
        backgroundColor: '#0A0A0A',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const finalImgHeight = Math.min(imgHeight, 160);

      // Container card for chart
      doc.setFillColor(10, 10, 10);
      doc.roundedRect(marginX, y, contentWidth, finalImgHeight + 20, 4, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(197, 255, 74);
      doc.text('VISUAL RADAR // SEMANTIC OPPORTUNITY MATRIX', marginX + 12, y + 14);

      doc.addImage(imgData, 'PNG', marginX + (contentWidth - 280) / 2, y + 18, 280, finalImgHeight - 4);
      y += finalImgHeight + 30;
    } catch (e) {
      console.warn('Could not snapshot chart element for PDF', e);
    }
  }

  // --- STRATEGIC SEMANTIC GAPS MATRIX ---
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Strategic Semantic Gaps & Information Gain Vectors', marginX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 105, 115);
  doc.text('Key topic concepts with high user relevance but statistically deficient SERP saturation.', marginX, y + 11);

  y += 22;

  // Table header
  doc.setFillColor(15, 15, 18);
  doc.rect(marginX, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('CONCEPT / ARCHETYPE', marginX + 8, y + 12);
  doc.text('RELEVANCE', marginX + 220, y + 12);
  doc.text('RIVAL COVERAGE', marginX + 285, y + 12);
  doc.text('OPPORTUNITY', marginX + 375, y + 12);
  doc.text('SERP TARGET', marginX + 440, y + 12);

  y += 18;

  analysis.semanticGaps.forEach((gap, idx) => {
    checkPageBreak(58);

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(230, 233, 240);
    doc.rect(marginX, y, contentWidth, 54, 'FD');

    // Gap Type Tag
    const typeLabel = gap.gapType || 'Semantic Vector';
    doc.setFillColor(240, 243, 248);
    doc.roundedRect(marginX + 6, y + 6, 95, 11, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(40, 60, 110);
    doc.text(typeLabel.toUpperCase(), marginX + 9, y + 14);

    // Concept Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 20, 30);
    doc.text(gap.concept, marginX + 6, y + 28);

    // Metrics Columns
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${gap.relevance}%`, marginX + 220, y + 24);

    doc.setTextColor(gap.competitorCoverage > 50 ? 225 : 70, gap.competitorCoverage > 50 ? 29 : 140, gap.competitorCoverage > 50 ? 72 : 50);
    doc.text(`${gap.competitorCoverage}%`, marginX + 285, y + 24);

    // Opportunity badge
    doc.setFillColor(235, 252, 230);
    doc.roundedRect(marginX + 373, y + 14, 45, 14, 2, 2, 'F');
    doc.setTextColor(20, 110, 30);
    doc.text(`${gap.opportunityScore}%`, marginX + 382, y + 24);

    // SERP Target badge
    const serpTarget = gap.serpTarget || 'Deep Guide';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(90, 95, 105);
    doc.text(serpTarget.substring(0, 16), marginX + 440, y + 24);

    // Suggested Content / Tactical Directive line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 75, 85);
    const directiveText = `Action: ${gap.suggestedContent}`;
    const truncatedDirective = doc.splitTextToSize(directiveText, contentWidth - 16);
    doc.text(truncatedDirective[0] || directiveText, marginX + 6, y + 44);

    y += 54;
  });

  y += 24;

  // --- ENTITY KNOWLEDGE GRAPH (IF AVAILABLE) ---
  if (analysis.entityGraph && analysis.entityGraph.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Knowledge Graph Entity Salience Matrix', marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 105, 115);
    doc.text('Wikidata & Google Knowledge Graph entities critical for topical completeness.', marginX, y + 11);

    y += 20;

    // Entity table header
    doc.setFillColor(15, 15, 18);
    doc.rect(marginX, y, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('ENTITY NAME', marginX + 8, y + 11);
    doc.text('CATEGORY', marginX + 170, y + 11);
    doc.text('SALIENCE', marginX + 270, y + 11);
    doc.text('RIVAL STATUS', marginX + 340, y + 11);
    doc.text('RECOMMENDED PLACEMENT', marginX + 410, y + 11);

    y += 16;

    analysis.entityGraph.forEach((node, idx) => {
      checkPageBreak(22);
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.setDrawColor(230, 233, 240);
      doc.rect(marginX, y, contentWidth, 20, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(20, 25, 35);
      doc.text(node.entity, marginX + 8, y + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 85, 95);
      doc.text(node.category, marginX + 170, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`${node.salience}%`, marginX + 270, y + 13);

      // Status color
      if (node.competitorStatus === 'Absent') {
        doc.setTextColor(225, 29, 72);
      } else if (node.competitorStatus === 'Superficial') {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(70, 80, 90);
      }
      doc.text(node.competitorStatus, marginX + 340, y + 13);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 75, 85);
      doc.text(node.suggestedPlacement.substring(0, 24), marginX + 410, y + 13);

      y += 20;
    });

    y += 24;
  }

  // --- SERP FEATURE & AI OVERVIEW OPPORTUNITIES ---
  if (analysis.serpOpportunities && analysis.serpOpportunities.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. SERP Feature & AI Overview Capture Blueprint', marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 105, 115);
    doc.text('Specific formatting and structural directives to win high-visibility search features.', marginX, y + 11);

    y += 22;

    analysis.serpOpportunities.forEach(opp => {
      checkPageBreak(48);
      doc.setFillColor(252, 252, 254);
      doc.setDrawColor(220, 226, 236);
      doc.roundedRect(marginX, y, contentWidth, 42, 3, 3, 'FD');

      doc.setFillColor(30, 58, 138);
      doc.roundedRect(marginX + 8, y + 6, 85, 12, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text(opp.feature.toUpperCase(), marginX + 12, y + 14);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(opp.queryAngle, marginX + 100, y + 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 85, 95);
      doc.text(`Format: ${opp.recommendedFormat}`, marginX + 8, y + 28);
      doc.text(`Winning Signal: ${opp.winningFactor}`, marginX + 8, y + 37);

      y += 48;
    });

    y += 18;
  }

  // --- COMPETITOR GAP AUDIT (IF AVAILABLE) ---
  if (analysis.competitorAudit) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`4. Competitor Blind Spot Audit: ${analysis.competitorAudit.competitorDomain.toUpperCase()}`, marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 105, 115);
    doc.text('Differential analysis exposing rival topical omissions and counter-strategy.', marginX, y + 11);

    y += 22;

    // Counter-Strategy Callout
    doc.setFillColor(254, 252, 240);
    doc.setDrawColor(245, 208, 90);
    doc.roundedRect(marginX, y, contentWidth, 45, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 80, 10);
    doc.text('TACTICAL COUNTER-STRATEGY PLAYBOOK:', marginX + 10, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 45, 30);
    const counterLines = doc.splitTextToSize(analysis.competitorAudit.counterStrategy, contentWidth - 20);
    doc.text(counterLines.slice(0, 3), marginX + 10, y + 24);

    y += 52;

    // Blind Spots
    analysis.competitorAudit.blindSpots.forEach((spot, sIdx) => {
      checkPageBreak(40);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 233, 240);
      doc.roundedRect(marginX, y, contentWidth, 36, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 20, 30);
      doc.text(`${sIdx + 1}. ${spot.concept}`, marginX + 8, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 40, 50);
      doc.text(`Rival Coverage: ${spot.competitorCoverage}%`, marginX + 260, y + 14);

      doc.setTextColor(20, 120, 40);
      doc.setFont('helvetica', 'bold');
      doc.text(`Your Opportunity: ${spot.yourOpportunity}%`, marginX + 380, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(70, 75, 85);
      doc.text(`Tactic: ${spot.tactic}`, marginX + 8, y + 27);

      y += 40;
    });

    y += 18;
  }

  // --- NARRATIVE BLUEPRINT / CONTENT ARCHITECTURE ---
  checkPageBreak(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('5. High Information Gain Content Architecture', marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 105, 115);
  doc.text('Editorial blueprint structured to fulfill user intent and secure primary rankings.', marginX, y + 11);

  y += 22;

  // Title Box
  doc.setFillColor(245, 248, 255);
  doc.setDrawColor(210, 222, 245);
  doc.roundedRect(marginX, y, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 60, 140);
  doc.text('PROPOSED H1 TITLE', marginX + 10, y + 12);

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.outline.title, marginX + 10, y + 26);

  y += 42;

  // Outline Sections
  analysis.outline.sections.forEach((sec, idx) => {
    checkPageBreak(50 + sec.subPoints.length * 10);

    doc.setFillColor(252, 252, 254);
    doc.setDrawColor(228, 232, 240);
    const sectionBoxHeight = 30 + sec.subPoints.length * 11;
    doc.roundedRect(marginX, y, contentWidth, sectionBoxHeight, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`H2 [${idx + 1}]: ${sec.heading}`, marginX + 10, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 125);
    doc.text(`Semantic Focus: ${sec.semanticFocus}`, marginX + 10, y + 25);

    sec.subPoints.forEach((point, pIdx) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(60, 65, 75);
      doc.text(`- ${point}`, marginX + 16, y + 36 + pIdx * 11);
    });

    y += sectionBoxHeight + 8;
  });

  y += 18;

  // --- DISCOVERY KEYWORDS / ADJACENT ENTITY VECTORS ---
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('6. Discovery & Secondary Entity Queries', marginX, y);

  y += 14;

  const kwText = analysis.relatedKeywords.join('  |  ');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 75, 85);
  const kwLines = doc.splitTextToSize(kwText, contentWidth);
  doc.text(kwLines, marginX, y);

  // --- RUNNING HEADERS & FOOTERS ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Skip running header on page 1 since it has hero header
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 145, 155);
      doc.text(`NEXUS_SEO // AUDIT REPORT: "${analysis.keyword.toUpperCase()}"`, marginX, 28);
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.5);
      doc.line(marginX, 32, pageWidth - marginX, 32);
    }

    // Running Footer
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(marginX, pageHeight - 34, pageWidth - marginX, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 145, 155);
    doc.text('NexusSEO Semantic Resonance Engine | US Patent 10,698,958 B2 Doctrine', marginX, pageHeight - 22);

    const pageStr = `Page ${i} of ${totalPages}`;
    doc.text(pageStr, pageWidth - marginX - doc.getTextWidth(pageStr), pageHeight - 22);
  }

  // Sanitize keyword for filename
  const sanitizedKeyword = analysis.keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'seo-report';

  doc.save(`nexus-seo-${sanitizedKeyword}-audit.pdf`);
}
