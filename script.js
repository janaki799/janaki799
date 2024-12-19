// Constants
// In script.js
const isDevelopment = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const BACKEND_URL = isDevelopment ? 'http://localhost:3000' : 'https://aarmahaveerincidentreporting.vercel.app';
const COLLEGE_CODE = '8P';

// Utility function to show/hide spinner
const toggleSpinner = (show) => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
};

// Function to handle the submission of the college code
function submitCode() {
    const collegeCodeInput = document.getElementById('collegeCode').value;
    console.log('Entered Code:', collegeCodeInput);

    if (collegeCodeInput.toUpperCase() === COLLEGE_CODE) {
        console.log('Redirecting to report page...');
        window.location.href = 'report.html';
    } else {
        alert('Invalid college code. Please try again.');
    }
}

// Function to populate incident types based on the selected category
function populateIncidentTypes() {
    const categorySelect = document.getElementById('incidentCategory');
    const typeSelect = document.getElementById('incidentType');
    if (!categorySelect || !typeSelect) return;
    // Clear current options
    typeSelect.innerHTML = '';

    // Define incident types mapping
    const incidentTypes = {
        maintenance: [
            "Broken Equipment",
            "Plumbing Issues",
            "Electrical Problems",
            "Damaged Furniture",
            "Elevator Malfunction",
            "HVAC Issues",
            "Building Damages"
        ],
        safety: [
            "Fire Hazards",
            "Theft",
            "Vandalism",
            "Unauthorized Access",
            "Physical Hazards",
            "Suspicious Behavior",
            "Medical Emergencies"
        ],
        academic: [
            "Cheating or Plagiarism",
            "Harassment by Faculty or Staff",
            "Unfair Grading",
            "Inappropriate Classroom Behavior"
        ],
        health: [
            "Unsanitary Conditions",
            "Food Safety",
            "COVID-19 or Other Infectious Diseases",
            "First Aid Issues"
        ],
        bullying: [
            "Bullying",
            "Sexual Harassment",
            "Cyber Bullying"
        ],
        environment: [
            "Pollution",
            "Noise Pollution",
            "Energy Wastage"
        ],
        transport: [
            "Parking Issues",
            "Transportation Delays",
            "Accidents"
        ],
        it: [
            "Network Issues",
            "Software Problems",
            "Access Issues"
        ],
        others: []
    };

    // Get selected category and populate types
    const selectedCategory = categorySelect.value;
    const types = incidentTypes[selectedCategory] || [];

    // Add options to select
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toUpperCase().replace(/\s+/g, '_');
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    // Add default option if no types
    if (types.length === 0) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Type';
        typeSelect.appendChild(defaultOption);
    }
}

// Function to handle image file selection
function handleImageUpload() {
    const imageInput = document.getElementById('image');
    const fileNameDisplay = document.getElementById('fileName');

    if (imageInput && fileNameDisplay) {
        imageInput.addEventListener('change', function() {
            fileNameDisplay.textContent = this.files.length 
                ? this.files[0].name 
                : 'No file selected';
        });
    }
}

// Function to submit the report
async function submitReport(formData) {
    try {
        const response = await fetch(`${BACKEND_URL}/reports`, {
            method: 'POST',
            body: formData,
             credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit report');
        }

        return data;
    } catch (error) {
        console.error('Error submitting report:', error.message, error.stack);
        throw error;
    }
}

// Event listener for DOM content load
document.addEventListener('DOMContentLoaded', () => {
    const incidentForm = document.getElementById('incidentForm');
    const incidentCategory = document.getElementById('incidentCategory');
    const imageInput = document.getElementById('image');

    // Add form submit handler
    if (incidentForm) {
        incidentForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            toggleSpinner(true);

            try {
                console.log('Submitting form...');

                // Gather form data
                const formData = new FormData(incidentForm);

                const imageFile = document.getElementById('image').files[0];
                if (imageFile) {
                    console.log('Image file:', {
                        name: imageFile.name,
                        size: imageFile.size,
                        type: imageFile.type
                    });
                }
                formData.set('collegeCode', COLLEGE_CODE);
                formData.set('incidentCategory', document.getElementById('incidentCategory').value);
                formData.set('incidentType', document.getElementById('incidentType').value);
                formData.set('description', document.getElementById('description').value);
                formData.set('date', document.getElementById('date').value || new Date().toISOString());

                // Submit report
                const response = await submitReport(formData);
                console.log('Report submitted successfully:', response);

                const successMessageDiv = document.createElement('div');
                successMessageDiv.className = 'success-message';
                successMessageDiv.innerHTML = 
                `
                    <h2>Report Submitted Successfully!</h2>
                    <p>Report ID: ${response.reportId}</p>
                    <p>Thank you for your submission.</p>
               ` ;
                document.body.appendChild(successMessageDiv);

                // Reset form and show success message
                alert('Your incident report has been submitted successfully!');
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit the report. Please try again.');
            } finally {
                toggleSpinner(false);
            }
        });
    }

    // Add category change handler
    if (incidentCategory) {
        incidentCategory.addEventListener('change', populateIncidentTypes);
    }

    // Add image upload handler
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }

    // Add spinner visibility handler
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    } else {
        console.error('Spinner element not found');
    }
});
// Automatically adjust the height of the textarea as the user types
const textarea = document.getElementById('description');

textarea.addEventListener('input', function () {
    this.style.height = 'auto';  // Reset the height to auto to recalculate
    this.style.height = (this.scrollHeight) + 'px';  // Set the height to the scrollHeight (content height)
});



      



      