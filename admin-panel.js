// Check authentication
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Auto-logout after 2 hours
const loginTime = sessionStorage.getItem('adminLoginTime');
if (loginTime && Date.now() - parseInt(loginTime) > 2 * 60 * 60 * 1000) {
    logout();
}

let selectedFile = null;

// Load and display current data
window.addEventListener('DOMContentLoaded', () => {
    loadCurrentData();
    setupDragAndDrop();
});

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
        showError('Please select a CSV file');
        return;
    }

    selectedFile = file;

    // Display file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileInfo').classList.add('show');

    // Hide any previous messages
    hideMessages();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function uploadFile() {
    if (!selectedFile) {
        showError('Please select a file first');
        return;
    }

    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('show');

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvContent = e.target.result;
            const programs = parseCSV(csvContent);

            if (programs.length === 0) {
                throw new Error('No valid program data found in CSV');
            }

            // Validate data
            validatePrograms(programs);

            // Store data in localStorage
            localStorage.setItem('programsData', JSON.stringify(programs));
            localStorage.setItem('lastUpdated', new Date().toISOString());

            // Update display
            loadCurrentData();

            // Show success message
            showSuccess(`Successfully imported ${programs.length} programs!`);

            // Reset file input
            selectedFile = null;
            document.getElementById('fileInput').value = '';
            document.getElementById('fileInfo').classList.remove('show');

            loadingOverlay.classList.remove('show');
        } catch (error) {
            loadingOverlay.classList.remove('show');
            showError('Error processing file: ' + error.message);
        }
    };

    reader.onerror = () => {
        loadingOverlay.classList.remove('show');
        showError('Error reading file');
    };

    reader.readAsText(selectedFile);
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const programs = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Handle CSV with quoted fields
        const values = parseCSVLine(lines[i]);
        const program = {};

        headers.forEach((header, index) => {
            let value = values[index] || '';
            value = value.trim().replace(/^"|"$/g, ''); // Remove quotes
            program[header] = value;
        });

        // Convert numeric fields
        if (program.lat) program.lat = parseFloat(program.lat);
        if (program.lng) program.lng = parseFloat(program.lng);
        if (program.capacity) program.capacity = parseInt(program.capacity);
        if (program.id) program.id = parseInt(program.id) || program.id;

        programs.push(program);
    }

    return programs;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current);
    return values;
}

function validatePrograms(programs) {
    const requiredFields = ['id', 'name', 'city', 'county', 'lat', 'lng'];

    programs.forEach((program, index) => {
        requiredFields.forEach(field => {
            if (!program[field]) {
                throw new Error(`Row ${index + 2}: Missing required field "${field}"`);
            }
        });

        // Validate coordinates
        if (isNaN(program.lat) || isNaN(program.lng)) {
            throw new Error(`Row ${index + 2}: Invalid coordinates`);
        }

        // Validate Massachusetts coordinates (approximately)
        if (program.lat < 41 || program.lat > 43 || program.lng < -74 || program.lng > -69) {
            throw new Error(`Row ${index + 2}: Coordinates outside Massachusetts bounds`);
        }
    });
}

function loadCurrentData() {
    const dataStr = localStorage.getItem('programsData');
    const lastUpdated = localStorage.getItem('lastUpdated');

    if (!dataStr) {
        return;
    }

    const programs = JSON.parse(dataStr);

    // Update statistics
    document.getElementById('totalPrograms').textContent = programs.length;

    const uniqueCounties = new Set(programs.map(p => p.county).filter(Boolean));
    document.getElementById('countiesCovered').textContent = uniqueCounties.size;

    const uniqueRegions = new Set(programs.map(p => p.region).filter(Boolean));
    document.getElementById('regionsCovered').textContent = uniqueRegions.size;

    if (lastUpdated) {
        const date = new Date(lastUpdated);
        document.getElementById('lastUpdated').textContent = date.toLocaleDateString();
    }

    // Update table
    const tbody = document.getElementById('programsTableBody');
    tbody.innerHTML = '';

    programs.slice(0, 20).forEach(program => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${program.id}</td>
            <td>${program.name}</td>
            <td>${program.city}</td>
            <td>${program.county}</td>
            <td>${program.region || '-'}</td>
            <td>${program.capacity || '-'}</td>
        `;
    });

    if (programs.length > 20) {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td colspan="6" style="text-align: center; color: #999; font-style: italic;">
                Showing first 20 of ${programs.length} programs
            </td>
        `;
    }
}

function showSuccess(message) {
    hideMessages();
    const successMsg = document.getElementById('successMessage');
    successMsg.textContent = message;
    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}

function showError(message) {
    hideMessages();
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');

    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 5000);
}

function hideMessages() {
    document.getElementById('successMessage').classList.remove('show');
    document.getElementById('errorMessage').classList.remove('show');
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
}

function downloadTemplate() {
    const csvContent = `id,name,address,city,county,region,zip,lat,lng,phone,email,website,services,ageRange,capacity
1,Sample Program,123 Main St,Boston,Suffolk,Northeast,02101,42.3601,-71.0589,(617) 555-0100,info@example.org,www.example.org,"Homework help, Sports",6-14,50
2,Example Center,456 State St,Springfield,Hampden,Western,01101,42.1015,-72.5898,(413) 555-0200,contact@example.org,www.example.org,"STEM, Arts",5-12,40`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program-template.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function viewMap() {
    window.location.href = 'index.html';
}
