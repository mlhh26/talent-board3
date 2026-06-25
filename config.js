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
    
    // Column mapping from Google Form (updated to match actual form structure)
    COLUMNS: {
        timestamp: 0,           // Timestamp column
        email: 1,               // Email address
        company: 2,             // Company name
        position: 3,            // Job Title
        employmentType: 4,      // Employment Type
        workLocation: 5,        // Work Location Model
        description: 6,         // Job Description
        requirements: 7,        // Required Skills and Qualifications
        experience: 8,          // Years of Experience Required
        salary: 9,              // Salary Range (Annual)
        deadline: 10,           // Application Deadline
        materials: 11,          // Required Application Materials
        urgency: 12,            // Urgency rating
        url: 13,                // Application link
        location: 14            // Location
    }
};

// Expected form fields in order:
// 1. Timestamp (auto)
// 2. Email address
// 3. Company Name
// 4. Job Title
// 5. Employment Type
// 6. Work Location Model
// 7. Job Description
// 8. Required Skills and Qualifications
// 9. Years of Experience Required
// 10. Salary Range (Annual)
// 11. Application Deadline
// 12. Required Application Materials
// 13. Urgency rating
// 14. Application link
// 15. Location
