// ==========================================
// TALENT BOARD - MAIN SCRIPT
// ==========================================

class TalentBoard {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.locations = new Set();
        this.employmentTypes = new Set();
        this.init();
    }

    init() {
        this.loadJobs();
        // Refresh data every 5 minutes
        setInterval(() => this.loadJobs(), CONFIG.REFRESH_INTERVAL);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('locationFilter').addEventListener('change', () => this.filterJobs());
        document.getElementById('employmentTypeFilter').addEventListener('change', () => this.filterJobs());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadJobs());
    }

    async loadJobs() {
        try {
            this.showLoading();
            const data = await this.fetchFromGoogleSheets();
            console.log('Loaded jobs:', data);
            this.jobs = data;
            this.populateFilters();
            this.filterJobs();
            this.updateStats();
            this.showContent();
        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showError();
        }
    }

    async fetchFromGoogleSheets() {
        // Use Google Sheets CSV export
        const sheetId = CONFIG.SHEET_ID;
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        try {
            const response = await fetch(csvUrl);
            if (!response.ok) throw new Error('Failed to fetch data');

            const csv = await response.text();
            console.log('CSV Data:', csv.substring(0, 500)); // Log first 500 chars
            const jobs = this.parseCSV(csv);
            console.log('Parsed jobs count:', jobs.length);
            return jobs;
        } catch (error) {
            console.error('Error fetching Google Sheet:', error);
            throw error;
        }
    }

    parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const jobs = [];

        console.log('Total lines:', lines.length);

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const fields = this.parseCSVLine(lines[i]);
            
            // Validate: must have minimum fields
            if (fields.length >= 3) {
                // Check if company and position are filled
                const company = fields[CONFIG.COLUMNS.company]?.trim();
                const position = fields[CONFIG.COLUMNS.position]?.trim();
                
                console.log(`Row ${i}: company="${company}", position="${position}"`);
                
                if (!company || !position) {
                    console.log(`Skipping row ${i}: missing company or position`);
                    continue;
                }
                
                const job = {
                    id: i,
                    timestamp: fields[CONFIG.COLUMNS.timestamp] || '',
                    company: company,
                    position: position,
                    location: fields[CONFIG.COLUMNS.location]?.trim() || 'Remote',
                    employmentType: fields[CONFIG.COLUMNS.employmentType]?.trim() || 'Full-time',
                    workLocation: fields[CONFIG.COLUMNS.workLocation]?.trim() || 'On-site',
                    description: fields[CONFIG.COLUMNS.description]?.trim() || 'No description provided',
                    requirements: fields[CONFIG.COLUMNS.requirements]?.trim() || '',
                    experience: fields[CONFIG.COLUMNS.experience]?.trim() || 'Not specified',
                    salary: fields[CONFIG.COLUMNS.salary]?.trim() || 'Competitive',
                    deadline: fields[CONFIG.COLUMNS.deadline]?.trim() || '',
                    urgency: fields[CONFIG.COLUMNS.urgency]?.trim() || '',
                    url: fields[CONFIG.COLUMNS.url]?.trim() || '#'
                };
                jobs.push(job);
                console.log('Added job:', job.company, job.position);
            }
        }

        return jobs.reverse(); // Show newest first
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    populateFilters() {
        this.locations.clear();
        this.employmentTypes.clear();

        this.jobs.forEach(job => {
            this.locations.add(job.location);
            this.employmentTypes.add(job.employmentType);
        });

        this.updateSelectOptions('locationFilter', Array.from(this.locations));
        this.updateSelectOptions('employmentTypeFilter', Array.from(this.employmentTypes));
    }

    updateSelectOptions(selectId, options) {
        const select = document.getElementById(selectId);
        const currentValue = select.value;

        // Keep the first option (all)
        while (select.options.length > 1) {
            select.remove(1);
        }

        options.sort().forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });

        select.value = currentValue;
    }

    filterJobs() {
        const locationFilter = document.getElementById('locationFilter').value;
        const employmentTypeFilter = document.getElementById('employmentTypeFilter').value;

        this.filteredJobs = this.jobs.filter(job => {
            const locationMatch = !locationFilter || job.location === locationFilter;
            const employmentTypeMatch = !employmentTypeFilter || job.employmentType === employmentTypeFilter;
            return locationMatch && employmentTypeMatch;
        });

        this.renderJobs();
        this.updateStats();
    }

    renderJobs() {
        const container = document.getElementById('jobsContainer');
        container.innerHTML = '';

        if (this.filteredJobs.length === 0) {
            document.getElementById('noResults').style.display = 'block';
            return;
        }

        document.getElementById('noResults').style.display = 'none';

        this.filteredJobs.forEach((job, index) => {
            const jobCard = this.createJobCard(job);
            jobCard.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(jobCard);
        });
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-title">${this.escapeHtml(job.position)}</div>
                <div class="job-card-company">${this.escapeHtml(job.company)}</div>
            </div>
            <div class="job-card-content">
                <div class="job-info">
                    <span class="job-info-icon">📍</span>
                    <span>${this.escapeHtml(job.location)}</span>
                </div>
                <div class="job-info">
                    <span class="job-info-icon">💼</span>
                    <span>${this.escapeHtml(job.employmentType)}</span>
                </div>
                <div class="job-info">
                    <span class="job-info-icon">🏢</span>
                    <span>${this.escapeHtml(job.workLocation)}</span>
                </div>
            </div>
            <div class="job-card-footer">
                <span class="job-date">${this.formatDate(job.timestamp)}</span>
            </div>
        `;

        // Click to show full details
        card.addEventListener('click', () => this.showJobDetails(job));

        return card;
    }

    showJobDetails(job) {
        const modal = document.createElement('div');
        modal.className = 'job-modal';
        modal.innerHTML = `
            <div class="job-modal-content">
                <button class="job-modal-close">&times;</button>
                <h2>${this.escapeHtml(job.position)}</h2>
                <h3>${this.escapeHtml(job.company)}</h3>
                
                <div class="job-details">
                    <p><strong>Location:</strong> ${this.escapeHtml(job.location)}</p>
                    <p><strong>Employment Type:</strong> ${this.escapeHtml(job.employmentType)}</p>
                    <p><strong>Work Location:</strong> ${this.escapeHtml(job.workLocation)}</p>
                    <p><strong>Experience Required:</strong> ${this.escapeHtml(job.experience)}</p>
                    <p><strong>Salary:</strong> ${this.escapeHtml(job.salary)}</p>
                    ${job.deadline ? `<p><strong>Application Deadline:</strong> ${this.escapeHtml(job.deadline)}</p>` : ''}
                    ${job.urgency ? `<p><strong>Urgency:</strong> ${this.escapeHtml(job.urgency)}</p>` : ''}
                    
                    <h4>Job Description</h4>
                    <p>${this.escapeHtml(job.description)}</p>
                    
                    ${job.requirements ? `<h4>Requirements & Qualifications</h4><p>${this.escapeHtml(job.requirements)}</p>` : ''}
                    
                    ${job.url && job.url !== '#' ? `<a href="${this.escapeHtml(job.url)}" target="_blank" class="job-apply-btn">Apply Now →</a>` : '<button class="job-apply-btn" disabled>Coming Soon</button>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        const closeBtn = modal.querySelector('.job-modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    updateStats() {
        const uniqueCompanies = new Set(this.filteredJobs.map(job => job.company)).size;

        document.getElementById('totalPositions').textContent = this.filteredJobs.length;
        document.getElementById('totalCompanies').textContent = uniqueCompanies;
        document.getElementById('lastUpdated').textContent = this.formatTime(new Date());
        document.getElementById('footerTime').textContent = this.formatDateTime(new Date());
    }

    formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Hoy';
            if (diffDays === 1) return 'Ayer';
            if (diffDays < 7) return `Hace ${diffDays} días`;
            if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' });
        } catch (error) {
            return 'Fecha no disponible';
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    formatDateTime(date) {
        return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('filters').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        document.getElementById('jobsContainer').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('error').style.display = 'none';
    }

    showContent() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('filters').style.display = 'flex';
        document.getElementById('stats').style.display = 'grid';
        document.getElementById('jobsContainer').style.display = 'grid';
        document.getElementById('error').style.display = 'none';
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('filters').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        document.getElementById('jobsContainer').style.display = 'none';
        document.getElementById('error').style.display = 'block';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TalentBoard();
});
