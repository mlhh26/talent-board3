// ==========================================
// CONFIGURATION FILE
// ==========================================

// Google Sheets API Configuration
const CONFIG = {
    // Replace with your actual Google Sheets ID
    SHEET_ID: '1pEzAFcI1Mfk9mnokDQ08TU3EllXq3o5kJ_SrBqIfLVs',
    
    // Sheet name where responses are stored
    SHEET_NAME: 'Form Responses 1', // Change if your sheet has a different name
    
    // Auto-refresh interval in milliseconds (5 minutes)
    REFRESH_INTERVAL: 5 * 60 * 1000,
    
    // Column mapping from Google Form
    COLUMNS: {
        timestamp: 0,      // Timestamp column
        company: 1,        // Company name
        position: 2,       // Position title
        location: 3,       // City/Location
        department: 4,     // Department
        description: 5,    // Job description
        requirements: 6,   // Requirements
        experience: 7,     // Experience level
        contract: 8,       // Contract type
        salary: 9,         // Salary range
        url: 10           // Application URL (optional)
    }
};

// Expected form fields in order:
// 1. Timestamp (auto)
// 2. Nombre de la Empresa
// 3. Posición
// 4. Ciudad
// 5. Departamento
// 6. Descripción del Puesto
// 7. Requisitos
// 8. Nivel de Experiencia
// 9. Tipo de Contrato
// 10. Rango Salarial
// 11. URL de Aplicación (opcional)