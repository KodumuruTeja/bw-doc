const WATERMARK_TEXT = 'PAYMENTUS PROPRIETARY';
const FOOTER_TEXT = '© 2026 Paymentus Corporation | PROPRIETARY & CONFIDENTIAL';
const BRAND_COLOR = '061E51';
const ACCENT_COLOR = '2364F6';
const CYAN_COLOR = '56C3FF';

function getPageTitle() {
    return document.querySelector('.page-hero h1')?.textContent || document.title;
}

function getPageSections() {
    const sections = [];
    const headings = document.querySelectorAll('.content-wrapper h2, .content-wrapper h3');
    headings.forEach(h => {
        let content = '';
        let el = h.nextElementSibling;
        while (el && !el.matches('h2, h3')) {
            content += el.textContent.trim() + '\n';
            el = el.nextElementSibling;
        }
        sections.push({ title: h.textContent.trim(), content: content.trim(), level: h.tagName });
    });
    return sections;
}

function getAllPageText() {
    const wrapper = document.querySelector('.content-wrapper') || document.querySelector('.page-content');
    return wrapper ? wrapper.textContent.trim() : document.body.textContent.trim();
}

// PPT Generation
async function downloadAsPPT() {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Paymentus Corporation';
    pptx.company = 'Paymentus';

    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: BRAND_COLOR };
    titleSlide.addText('BillWallet™', { x: 0.5, y: 1.0, w: 9, h: 1.5, fontSize: 48, bold: true, color: 'FFFFFF', fontFace: 'Montserrat' });
    titleSlide.addText(getPageTitle(), { x: 0.5, y: 2.5, w: 9, h: 1, fontSize: 24, color: CYAN_COLOR, fontFace: 'Barlow Condensed' });
    titleSlide.addText(FOOTER_TEXT, { x: 0.5, y: 7.0, w: 12, h: 0.4, fontSize: 8, color: '999999', fontFace: 'Montserrat' });
    titleSlide.addText(WATERMARK_TEXT, { x: 2, y: 3, w: 8, h: 2, fontSize: 36, color: 'FFFFFF', transparency: 85, rotate: -30, fontFace: 'Montserrat' });

    const sections = getPageSections();
    for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (s.level === 'H2') {
            const slide = pptx.addSlide();
            slide.addText(s.title, { x: 0.5, y: 0.3, w: 12, h: 0.8, fontSize: 22, bold: true, color: BRAND_COLOR, fontFace: 'Barlow Condensed' });
            const contentText = s.content.substring(0, 1500);
            slide.addText(contentText, { x: 0.5, y: 1.2, w: 12, h: 5.5, fontSize: 11, color: '333333', fontFace: 'Montserrat', valign: 'top', wrap: true });
            slide.addText(FOOTER_TEXT, { x: 0.5, y: 7.0, w: 12, h: 0.4, fontSize: 8, color: '999999', fontFace: 'Montserrat' });
            slide.addText(WATERMARK_TEXT, { x: 2, y: 3, w: 8, h: 2, fontSize: 36, color: 'CCCCCC', transparency: 85, rotate: -30, fontFace: 'Montserrat' });
        }
    }

    const fileName = getPageTitle().replace(/[^a-zA-Z0-9]/g, '_') + '.pptx';
    await pptx.writeFile({ fileName });
}

// PDF Generation
async function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    function addWatermark() {
        doc.setFontSize(40);
        doc.setTextColor(220, 220, 220);
        doc.text(WATERMARK_TEXT, pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
    }

    function addFooter() {
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(FOOTER_TEXT, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    doc.setFillColor(6, 30, 81);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('BillWallet™', 15, 18);
    doc.setFontSize(14);
    doc.setTextColor(86, 195, 255);
    doc.text(getPageTitle(), 15, 28);
    addWatermark();
    addFooter();

    const sections = getPageSections();
    let yPos = 45;

    for (const section of sections) {
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 20;
            addWatermark();
            addFooter();
        }

        if (section.level === 'H2') {
            doc.setFontSize(14);
            doc.setTextColor(6, 30, 81);
            doc.text(section.title, 15, yPos);
            yPos += 8;
        } else {
            doc.setFontSize(11);
            doc.setTextColor(35, 100, 246);
            doc.text(section.title, 15, yPos);
            yPos += 6;
        }

        doc.setFontSize(9);
        doc.setTextColor(51, 51, 51);
        const lines = doc.splitTextToSize(section.content.substring(0, 2000), pageWidth - 30);
        for (const line of lines) {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
                addWatermark();
                addFooter();
            }
            doc.text(line, 15, yPos);
            yPos += 4;
        }
        yPos += 6;
    }

    const fileName = getPageTitle().replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    doc.save(fileName);
}

// Poster / Image Generation
async function downloadAsPoster() {
    const content = document.querySelector('.content-wrapper') || document.querySelector('.page-content');
    if (!content) return;

    const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    });

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.font = '60px Montserrat, sans-serif';
    ctx.fillStyle = '#061E51';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    for (let y = -canvas.height; y < canvas.height; y += 200) {
        for (let x = -canvas.width; x < canvas.width; x += 600) {
            ctx.fillText(WATERMARK_TEXT, x, y);
        }
    }
    ctx.restore();

    ctx.fillStyle = '#061E51';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.font = '16px Montserrat, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(FOOTER_TEXT, canvas.width / 2, canvas.height - 15);

    const link = document.createElement('a');
    link.download = getPageTitle().replace(/[^a-zA-Z0-9]/g, '_') + '_poster.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Copy full page text
function copyPageText() {
    const text = getAllPageText();
    navigator.clipboard.writeText(text).then(() => {
        showToast('Page text copied to clipboard!');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Page text copied to clipboard!');
    });
}

// Copy section text
function copySectionText(sectionEl) {
    const text = sectionEl.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        showToast('Section copied!');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Section copied!');
    });
}

// Download section as image
async function downloadSectionImage(sectionEl) {
    const canvas = await html2canvas(sectionEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    });

    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.06;
    ctx.font = '30px Montserrat, sans-serif';
    ctx.fillStyle = '#061E51';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText(WATERMARK_TEXT, -150, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

    const link = document.createElement('a');
    const heading = sectionEl.querySelector('h2, h3');
    const name = heading ? heading.textContent.replace(/[^a-zA-Z0-9]/g, '_') : 'section';
    link.download = name + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Initialize download dropdown and section tools
function initDownloadTools() {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    // Add floating download dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'download-fab';
    dropdown.innerHTML = `
        <button class="fab-btn" title="Downloads & Export">
            <i class="fas fa-download"></i>
        </button>
        <div class="fab-menu">
            <button onclick="downloadAsPPT()" title="Download as PowerPoint"><i class="fas fa-file-powerpoint"></i> Download PPT</button>
            <button onclick="downloadAsPDF()" title="Download as PDF"><i class="fas fa-file-pdf"></i> Download PDF</button>
            <button onclick="downloadAsPoster()" title="Download as Poster Image"><i class="fas fa-image"></i> Download Poster</button>
            <button onclick="copyPageText()" title="Copy all text"><i class="fas fa-copy"></i> Copy All Text</button>
        </div>
    `;
    document.body.appendChild(dropdown);

    dropdown.querySelector('.fab-btn').addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });

    // Add section toolbars
    const sections = document.querySelectorAll('.content-wrapper > h2');
    sections.forEach(h2 => {
        let sectionContent = [h2];
        let el = h2.nextElementSibling;
        while (el && !el.matches('h2')) {
            sectionContent.push(el);
            el = el.nextElementSibling;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'section-block';
        h2.parentNode.insertBefore(wrapper, h2);
        sectionContent.forEach(node => wrapper.appendChild(node));

        const toolbar = document.createElement('div');
        toolbar.className = 'section-toolbar';
        toolbar.innerHTML = `
            <button class="toolbar-btn" title="Copy section text"><i class="fas fa-copy"></i></button>
            <button class="toolbar-btn" title="Download section as image"><i class="fas fa-camera"></i></button>
        `;
        wrapper.insertBefore(toolbar, wrapper.firstChild);

        const [copyBtn, imgBtn] = toolbar.querySelectorAll('.toolbar-btn');
        copyBtn.addEventListener('click', () => copySectionText(wrapper));
        imgBtn.addEventListener('click', () => downloadSectionImage(wrapper));
    });
}

document.addEventListener('DOMContentLoaded', initDownloadTools);
