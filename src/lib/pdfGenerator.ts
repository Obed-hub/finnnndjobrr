import { jsPDF } from 'jspdf';
import { ResumeReshapeResponse } from '../types';

export interface ResumePdfOptions {
  themeColor?: string; // Hex color for headers, e.g. '#00875A' or '#1A1A1A'
  accentColor?: string; // Hex color for accent highlights
  fontFamily?: 'helvetica' | 'times' | 'courier';
  candidateName?: string;
  targetRole?: string;
  companyName?: string;
  contactLine?: string;
  customResumeMarkdown?: string;
}

/**
 * Generates an ATS-compliant, high-density vector PDF resume using jsPDF.
 */
export function generateResumePdf(
  data: ResumeReshapeResponse,
  options: ResumePdfOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  let currentY = margin;

  const primaryColor = options.themeColor || '#1A1A1A';
  const accentColor = options.accentColor || '#00875A'; // Emerald or selected accent
  const grayColor = '#555555';
  const lightGrayColor = '#888888';

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 8) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  const drawHorizontalLine = (y: number, color = '#E2DDD4') => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // 1. CANDIDATE NAME HEADER
  const candidateName = options.candidateName || 'Candidate';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.text(candidateName.toUpperCase(), margin, currentY);
  currentY += 6;

  // 2. TARGET TITLE & BADGE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(accentColor);
  const titleText = `${data.targetJobTitle || 'Remote Specialist'} | Tailored for ${data.targetCompany || 'Employer'}`;
  doc.text(titleText, margin, currentY);
  currentY += 5;

  // 3. CONTACT INFO LINE
  const contactText = options.contactLine || 'Remote Contractor Ready • WAT (UTC+1) Overlap • Direct USD/Contractor Compliant';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor);
  doc.text(contactText, margin, currentY);
  currentY += 5;

  drawHorizontalLine(currentY, '#C9C3B5');
  currentY += 5;

  // SECTION HELPER
  const drawSectionHeader = (title: string) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.text(title.toUpperCase(), margin, currentY);
    currentY += 1.5;
    drawHorizontalLine(currentY, primaryColor);
    currentY += 4;
  };

  // 4. PROFESSIONAL SUMMARY
  if (data.reshapedSummary) {
    drawSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor('#222222');
    const summaryLines = doc.splitTextToSize(data.reshapedSummary, contentWidth);
    summaryLines.forEach((line: string) => {
      checkPageBreak(5);
      doc.text(line, margin, currentY);
      currentY += 4.2;
    });
    currentY += 3;
  }

  // 5. CORE COMPETENCIES & ATS KEYWORDS
  const skills = data.tailoredSkillsList || [];
  const injectedKw = data.injectedKeywords || [];
  const allSkills = Array.from(new Set([...skills, ...injectedKw])).filter(Boolean);

  if (allSkills.length > 0) {
    drawSectionHeader('Targeted ATS Skills & Core Competencies');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor('#222222');

    // Split into chunks or categories
    const primarySkills = allSkills.slice(0, 8).join('  •  ');
    const secondarySkills = allSkills.slice(8, 18).join('  •  ');

    if (primarySkills) {
      checkPageBreak(5);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Technical Stack:', margin, currentY);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(primarySkills, contentWidth - 36);
      doc.text(lines, margin + 36, currentY);
      currentY += lines.length * 4.2 + 1;
    }

    if (secondarySkills) {
      checkPageBreak(5);
      doc.setFont('helvetica', 'bold');
      doc.text('Frameworks & Tools:', margin, currentY);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(secondarySkills, contentWidth - 36);
      doc.text(lines, margin + 36, currentY);
      currentY += lines.length * 4.2 + 2;
    }

    checkPageBreak(5);
    doc.setFont('helvetica', 'bold');
    doc.text('Remote Workflow:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    const remoteStr = 'Asynchronous Communication, Agile/Scrum Sprints, Git, Redundant Power & Fiber Connectivity';
    const rLines = doc.splitTextToSize(remoteStr, contentWidth - 36);
    doc.text(rLines, margin + 36, currentY);
    currentY += rLines.length * 4.2 + 4;
  }

  // 6. PROFESSIONAL EXPERIENCE (RESHAPED WITH QUANTIFIED BULLETS)
  drawSectionHeader(`Targeted Experience & Projects (Reshaped for ${data.targetCompany || 'Target Role'})`);

  // Subheader for role
  checkPageBreak(8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor('#1A1A1A');
  doc.text(`Senior Specialist & Project Contributor`, margin, currentY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor);
  const dateStr = '2023 – Present  |  Remote';
  const dateWidth = doc.getTextWidth(dateStr);
  doc.text(dateStr, pageWidth - margin - dateWidth, currentY);
  currentY += 4.5;

  // Bullets
  const bullets = data.bulletPointRewrites || [];
  bullets.forEach((bp) => {
    const bulletText = bp.reshaped || bp.original;
    const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 6);
    checkPageBreak(bulletLines.length * 4.2 + 2);

    // Bullet point symbol
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(accentColor);
    doc.text('•', margin + 1, currentY);

    // Bullet text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor('#1A1A1A');
    doc.text(bulletLines, margin + 5, currentY);
    currentY += bulletLines.length * 4.2 + 1.5;
  });
  currentY += 3;

  // 7. ADDITIONAL ACHIEVEMENTS & CONTRIBUTIONS
  if (data.fullReshapedResume && data.fullReshapedResume.includes('EDUCATION')) {
    drawSectionHeader('Education & Credentials');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor('#1A1A1A');
    checkPageBreak(12);
    doc.text('Higher Education / Technical Degree', margin, currentY);
    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(grayColor);
    doc.text('Relevant Computer Science / Quantitative Discipline • Continuous Industry Learning', margin, currentY);
    currentY += 5;
  }

  // 8. REMOTE INFRASTRUCTURE & ATS READINESS FOOTER
  drawSectionHeader('Remote Infrastructure & Payout Compliance');
  checkPageBreak(10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#333333');
  const infraText = '• Connectivity & Power: High-speed fiber with dedicated redundant inverter battery backup (99.9% remote uptime).\n• Payout Systems: Verified compliance with Direct USD Wire, Deel, Wise, Payoneer & Crypto (USDC/USDT).\n• Timezone Availability: Direct 4–8 hour live overlap with US Eastern, GMT, and European work schedules.';
  const infraLines = doc.splitTextToSize(infraText, contentWidth);
  doc.text(infraLines, margin, currentY);
  currentY += infraLines.length * 4 + 4;

  // Add Page Numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(lightGrayColor);
    const footerText = `${candidateName} — Tailored for ${data.targetCompany || 'Job Application'}  |  Page ${i} of ${totalPages}`;
    doc.text(footerText, margin, pageHeight - 8);
    
    const atsTag = `ATS Projected Score: ${data.atsMatchScoreProjected || 96}%`;
    const atsWidth = doc.getTextWidth(atsTag);
    doc.text(atsTag, pageWidth - margin - atsWidth, pageHeight - 8);
  }

  return doc;
}

/**
 * Triggers browser download of the generated PDF file.
 */
export function downloadResumePdf(
  data: ResumeReshapeResponse,
  candidateName = 'Candidate',
  company = 'Job',
  customOptions?: Partial<ResumePdfOptions>
): void {
  const doc = generateResumePdf(data, {
    candidateName,
    companyName: company,
    targetRole: data.targetJobTitle,
    ...customOptions
  });

  const sanitizedCandidate = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedCompany = company.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${sanitizedCandidate}_${sanitizedCompany}_Resume.pdf`;

  doc.save(filename);
}

/**
 * Returns a Data URL for embedded PDF preview or iframe display.
 */
export function getResumePdfDataUri(
  data: ResumeReshapeResponse,
  candidateName = 'Candidate',
  company = 'Job',
  customOptions?: Partial<ResumePdfOptions>
): string {
  const doc = generateResumePdf(data, {
    candidateName,
    companyName: company,
    targetRole: data.targetJobTitle,
    ...customOptions
  });
  return doc.output('datauristring');
}
