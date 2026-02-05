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

            // Validate data (only requires name, lat, lng - all other fields optional)
            validatePrograms(programs);

            // Store data in localStorage (for preview)
            localStorage.setItem('programsData', JSON.stringify(programs));
            localStorage.setItem('lastUpdated', new Date().toISOString());

            // Update display
            loadCurrentData();

            // Show success message with download button
            showSuccessWithDownload(programs.length);

            // Show info about console warnings if user wants details
            console.log('✓ Successfully imported', programs.length, 'programs');
            console.log('ℹ Check browser console above for any warnings about missing optional fields');

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

    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const programs = [];

    // Map common column name variations to standard names
    const headerMapping = {
        'name': ['name', 'program name', 'programname', 'program_name', 'facility name'],
        'lat': ['lat', 'latitude', 'y', 'y_coord'],
        'lng': ['lng', 'lon', 'long', 'longitude', 'x', 'x_coord'],
        'address': ['address', 'street', 'street address', 'location'],
        'city': ['city', 'town', 'municipality'],
        'county': ['county'],
        'region': ['region', 'area'],
        'zip': ['zip', 'zipcode', 'zip code', 'postal code', 'postalcode'],
        'phone': ['phone', 'telephone', 'phone number', 'contact number'],
        'email': ['email', 'e-mail', 'contact email'],
        'website': ['website', 'web site', 'url', 'web'],
        'services': ['services', 'programs', 'offerings'],
        'ageRange': ['agerange', 'age range', 'age_range', 'ages', 'age group'],
        'capacity': ['capacity', 'max capacity', 'enrollment']
    };

    // Create normalized header map
    const normalizedHeaders = {};
    rawHeaders.forEach((header, index) => {
        const normalized = header.toLowerCase().trim();

        // Find which standard field this maps to
        for (const [standardName, variations] of Object.entries(headerMapping)) {
            if (variations.includes(normalized)) {
                normalizedHeaders[standardName] = index;
                break;
            }
        }

        // If no mapping found, keep original header as-is
        if (!Object.values(normalizedHeaders).includes(index)) {
            normalizedHeaders[header] = index;
        }
    });

    console.log('Detected columns:', Object.keys(normalizedHeaders));

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Handle CSV with quoted fields
        const values = parseCSVLine(lines[i]);
        const program = {};

        // Map values using normalized headers
        for (const [standardName, valueIndex] of Object.entries(normalizedHeaders)) {
            let value = values[valueIndex] || '';
            value = value.trim().replace(/^"|"$/g, ''); // Remove quotes
            program[standardName] = value;
        }

        // Convert numeric fields
        if (program.lat) program.lat = parseFloat(program.lat);
        if (program.lng) program.lng = parseFloat(program.lng);
        if (program.capacity) program.capacity = parseInt(program.capacity) || null;
        if (program.id) program.id = parseInt(program.id) || program.id;

        // Set defaults for missing fields
        if (!program.id) program.id = i; // Use row number as fallback ID
        if (!program.address) program.address = '';
        if (!program.city) program.city = '';
        if (!program.county) program.county = '';
        if (!program.region) program.region = '';
        if (!program.zip) program.zip = '';
        if (!program.phone) program.phone = '';
        if (!program.email) program.email = '';
        if (!program.website) program.website = '';
        if (!program.services) program.services = '';
        if (!program.ageRange) program.ageRange = '';

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
    // Only require absolute essentials: name and coordinates
    const requiredFields = ['name', 'lat', 'lng'];
    const warnings = [];

    programs.forEach((program, index) => {
        const rowNum = index + 2;

        // Check required fields with better error messages
        requiredFields.forEach(field => {
            if (!program[field] || program[field] === '') {
                const availableFields = Object.keys(program).filter(k => program[k] !== '').join(', ');
                throw new Error(
                    `Row ${rowNum}: Missing required field "${field}"\n\n` +
                    `Required: name, lat (latitude), lng (longitude)\n` +
                    `Found columns with data: ${availableFields || 'none'}\n\n` +
                    `TIP: Make sure your CSV has columns named "name", "lat" (or "latitude"), and "lng" (or "longitude", "lon", "long")`
                );
            }
        });

        // Validate coordinates are numbers
        if (isNaN(program.lat) || isNaN(program.lng)) {
            throw new Error(
                `Row ${rowNum}: Invalid coordinates\n` +
                `lat: "${program.lat}" (must be a number)\n` +
                `lng: "${program.lng}" (must be a number)\n\n` +
                `Example valid coordinates for Massachusetts:\n` +
                `Boston: lat 42.3601, lng -71.0589`
            );
        }

        // Warn if coordinates seem outside Massachusetts (but don't fail)
        if (program.lat < 41 || program.lat > 43 || program.lng < -74 || program.lng > -69) {
            warnings.push(`Row ${rowNum} (${program.name}): Coordinates may be outside Massachusetts`);
        }

        // Warn about missing optional but recommended fields
        if (!program.city) warnings.push(`Row ${rowNum} (${program.name}): Missing city`);
        if (!program.county) warnings.push(`Row ${rowNum} (${program.name}): Missing county`);
    });

    // Log warnings to console but don't fail
    if (warnings.length > 0) {
        console.warn('Data import warnings:');
        warnings.forEach(w => console.warn('  - ' + w));
    }
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

function showSuccessWithDownload(count) {
    hideMessages();
    const successMsg = document.getElementById('successMessage');
    successMsg.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>✓ Successfully imported ${count} programs!</span>
            <button onclick="downloadProgramsJSON()" style="padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; margin-left: 1rem;">
                Download programs.json
            </button>
        </div>
        <div style="margin-top: 0.75rem; font-size: 0.875rem; opacity: 0.9;">
            Download the file and add it to your repository at <code style="background: rgba(0,0,0,0.1); padding: 0.125rem 0.375rem; border-radius: 0.25rem;">data/programs.json</code>
        </div>
    `;
    successMsg.classList.add('show');
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

function downloadProgramsJSON() {
    const dataStr = localStorage.getItem('programsData');
    if (!dataStr) {
        alert('No program data to download. Please import a CSV file first.');
        return;
    }

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'programs.json';
    a.click();
    URL.revokeObjectURL(url);

    // Show instructions
    setTimeout(() => {
        if (confirm('File downloaded! Would you like to see instructions on how to update your repository?')) {
            showUpdateInstructions();
        }
    }, 500);
}

function showUpdateInstructions() {
    const instructions = `
HOW TO UPDATE YOUR MAP DATA:

The programs.json file has been downloaded to your computer.
Follow these steps to make it live on your map:

OPTION 1 - Using GitHub Web Interface (Easiest):
1. Go to: https://github.com/MAPASOST/mappingtool
2. Navigate to the 'data' folder
3. Click "Add file" → "Upload files"
4. Drag the downloaded programs.json file
5. Scroll down and click "Commit changes"
6. Your map will update in 1-2 minutes!

OPTION 2 - Using Git Command Line:
1. Place programs.json in your local repo at: data/programs.json
2. Run these commands:
   git add data/programs.json
   git commit -m "Update afterschool programs data"
   git push origin claude/ma-afterschool-programs-map-ngHCL
3. Your map will update in 1-2 minutes!

NOTE: After updating, clear your browser cache or do a hard refresh (Ctrl+F5 or Cmd+Shift+R) to see the changes immediately.
    `.trim();

    alert(instructions);
}
