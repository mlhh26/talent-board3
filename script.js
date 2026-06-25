// ==========================================
// TALENT BOARD - MAIN SCRIPT
// ==========================================

class TalentBoard {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.locations = new Set();
        this.departments = new Set();
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
        document.getElementById('departmentFilter').addEventListener('change', () => this.filterJobs());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadJobs());
    }

    async loadJobs() {
        try {
            this.showLoading();
            const data = await this.fetchFromGoogleSheets();
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
            const jobs = this.parseCSV(csv);
            return jobs;
        } catch (error) {
            console.error('Error fetching Google Sheet:', error);
            // Return demo data if fetch fails
            return this.getDemoData();
        }
    }

    parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const jobs = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const fields = this.parseCSVLine(lines[i]);
            
            // Validate: must have minimum fields and company name must exist
            if (fields.length >= 15 && fields[2]) {
                // Skip empty rows - check if company and position are filled
                const company = fields[CONFIG.COLUMNS.company]?.trim();
                const position = fields[CONFIG.COLUMNS.position]?.trim();
                
                if (!company || !position) {
                    continue; // Skip incomplete entries
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
        this.departments.clear();

        this.jobs.forEach(job => {
            this.locations.add(job.location);
            this.departments.add(job.employmentType);
        });

        this.updateSelectOptions('locationFilter', Array.from(this.locations));
        this.updateSelectOptions('departmentFilter', Array.from(this.departments));
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
        const departmentFilter = document.getElementById('departmentFilter').value;

        this.filteredJobs = this.jobs.filter(job => {
            const locationMatch = !locationFilter || job.location === locationFilter;
            const departmentMatch = !departmentFilter || job.employmentType === departmentFilter;
            return locationMatch && departmentMatch;
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

        const tags = this.getJobTags(job);

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
                <div class="job-description">${this.escapeHtml(job.description.substring(0, 150))}${job.description.length > 150 ? '...' : ''}</div>
                <div class="job-tags">
                    ${tags.map(tag => `<span class="job-tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
            <div class="job-card-footer">
                <span class="job-date">${this.formatDate(job.timestamp)}</span>
                ${job.url && job.url !== '#' ? `<a href="${this.escapeHtml(job.url)}" target="_blank" class="job-link-btn">Aplicar →</a>` : '<button class="job-link-btn" disabled>Próximamente</button>'}
            </div>
        `;

        return card;
    }

    getJobTags(job) {
        const tags = [];
        if (job.experience && job.experience !== 'Not specified') tags.push(job.experience);
        if (job.salary && job.salary !== 'Competitive' && job.salary !== 'undisclosed') tags.push(job.salary);
        if (job.urgency) tags.push(`Urgency: ${job.urgency}`);
        return tags.slice(0, 3); // Show max 3 tags
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

    getDemoData() {
        return [
            {
                id: 1,
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                company: 'MediCare Plus',
                position: 'Enfermero/a Especialista',
                location: 'Barcelona',
                employmentType: 'Full-time',
                workLocation: 'On-site',
                description: 'Buscamos enfermero/a especialista en cuidados intensivos con experiencia en hospitales de referencia.',
                requirements: 'Titulación en Enfermería, Experiencia +3 años',
                experience: 'Senior',
                salary: '€2.200 - €2.500',
                deadline: '',
                urgency: '',
                url: 'https://www.medicareplus.es/careers'
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                company: 'Clínica Dental Smile',
                position: 'Dentista Junior',
                location: 'Madrid',
                employmentType: 'Full-time',
                workLocation: 'On-site',
                description: 'Se requiere dentista recién graduado para unirse a nuestro equipo dinámico en la clínica central.',
                requirements: 'Licenciado en Odontología, Colegiado',
                experience: 'Junior',
                salary: '€1.800 - €2.100',
                deadline: '',
                urgency: '',
                url: 'https://www.clinicasmile.es/empleo'
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                company: 'Farmacia Central López',
                position: 'Farmacéutico/a',
                location: 'Málaga',
                employmentType: 'Part-time',
                workLocation: 'On-site',
                description: 'Farmacéutico para trabajar en dispensario y atención farmacéutica clínica.',
                requirements: 'Grado en Farmacia, Experiencia +2 años',
                experience: 'Mid-level',
                salary: '€1.600 - €1.900',
                deadline: '',
                urgency: '',
                url: ''
            }
        ];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TalentBoard();
});
