// ===========================
// Global State Management
// ===========================
const AppState = {
    map: null,
    markers: [],
    programs: [],
    filteredPrograms: []
};

// Massachusetts center coordinates
const MA_CENTER = [42.4072, -71.3824];
const MA_BOUNDS = [[41.2, -73.5], [42.9, -69.9]];

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    loadSampleData();
    setupEventListeners();
});

// ===========================
// Map Initialization
// ===========================
function initializeMap() {
    // Initialize map
    AppState.map = L.map('map', {
        center: MA_CENTER,
        zoom: 8,
        minZoom: 7,
        maxZoom: 18,
        maxBounds: MA_BOUNDS
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(AppState.map);

    // Hide loading overlay
    setTimeout(() => {
        document.getElementById('mapLoading').classList.add('hidden');
    }, 1000);
}

// ===========================
// Data Initialization
// ===========================
function populateCountyFilter() {
    // Massachusetts counties
    const counties = [
        'Barnstable', 'Berkshire', 'Bristol', 'Dukes', 'Essex', 'Franklin',
        'Hampden', 'Hampshire', 'Middlesex', 'Nantucket', 'Norfolk',
        'Plymouth', 'Suffolk', 'Worcester'
    ];

    const countyFilter = document.getElementById('countyFilter');
    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        option.textContent = county;
        countyFilter.appendChild(option);
    });
}

// ===========================
// Sample Data
// ===========================
function loadSampleData() {
    // Populate county dropdown
    populateCountyFilter();

    // Sample afterschool programs data
    AppState.programs = [
        {
            id: 1,
            name: 'Boston Youth Center',
            address: '123 Main St',
            city: 'Boston',
            county: 'Suffolk',
            region: 'Northeast',
            zip: '02101',
            lat: 42.3601,
            lng: -71.0589,
            phone: '(617) 555-0100',
            email: 'info@bostonyouth.org',
            website: 'www.bostonyouth.org',
            services: 'Homework help, Sports, Arts',
            ageRange: '6-14',
            capacity: 50
        },
        {
            id: 2,
            name: 'Springfield After School Program',
            address: '456 State St',
            city: 'Springfield',
            county: 'Hampden',
            region: 'Western',
            zip: '01101',
            lat: 42.1015,
            lng: -72.5898,
            phone: '(413) 555-0200',
            email: 'contact@springfieldprogram.org',
            website: 'www.springfieldprogram.org',
            services: 'STEM, Music, Tutoring',
            ageRange: '5-12',
            capacity: 40
        },
        {
            id: 3,
            name: 'Worcester Learning Center',
            address: '789 Park Ave',
            city: 'Worcester',
            county: 'Worcester',
            region: 'Central',
            zip: '01601',
            lat: 42.2626,
            lng: -71.8023,
            phone: '(508) 555-0300',
            email: 'info@worcesterlearning.org',
            website: 'www.worcesterlearning.org',
            services: 'Reading, Math, Recreation',
            ageRange: '7-15',
            capacity: 60
        },
        {
            id: 4,
            name: 'Cambridge Youth Academy',
            address: '321 College Rd',
            city: 'Cambridge',
            county: 'Middlesex',
            region: 'Northeast',
            zip: '02138',
            lat: 42.3736,
            lng: -71.1097,
            phone: '(617) 555-0400',
            email: 'info@cambridgeyouth.org',
            website: 'www.cambridgeyouth.org',
            services: 'Technology, Science, Arts',
            ageRange: '8-16',
            capacity: 45
        },
        {
            id: 5,
            name: 'New Bedford Community Center',
            address: '555 Harbor St',
            city: 'New Bedford',
            county: 'Bristol',
            region: 'Southeast',
            zip: '02740',
            lat: 41.6362,
            lng: -70.9342,
            phone: '(508) 555-0500',
            email: 'info@nbcommunity.org',
            website: 'www.nbcommunity.org',
            services: 'Sports, Arts, Leadership',
            ageRange: '6-13',
            capacity: 35
        },
        {
            id: 6,
            name: 'Cape Cod Kids Club',
            address: '100 Beach Rd',
            city: 'Barnstable',
            county: 'Barnstable',
            region: 'Cape',
            zip: '02601',
            lat: 41.7003,
            lng: -70.3002,
            phone: '(508) 555-0600',
            email: 'info@capekids.org',
            website: 'www.capekids.org',
            services: 'Outdoor activities, Marine science, Arts',
            ageRange: '5-14',
            capacity: 30
        },
        {
            id: 7,
            name: 'Lowell Youth Development',
            address: '789 Merrimack St',
            city: 'Lowell',
            county: 'Middlesex',
            region: 'Northeast',
            zip: '01852',
            lat: 42.6334,
            lng: -71.3162,
            phone: '(978) 555-0700',
            email: 'info@lowellyouth.org',
            website: 'www.lowellyouth.org',
            services: 'Tutoring, Sports, Cultural programs',
            ageRange: '6-15',
            capacity: 55
        },
        {
            id: 8,
            name: 'Pittsfield Educational Center',
            address: '456 Mountain View',
            city: 'Pittsfield',
            county: 'Berkshire',
            region: 'Western',
            zip: '01201',
            lat: 42.4501,
            lng: -73.2453,
            phone: '(413) 555-0800',
            email: 'info@pittsfieldcenter.org',
            website: 'www.pittsfieldcenter.org',
            services: 'Environmental education, Arts, STEM',
            ageRange: '7-14',
            capacity: 40
        }
    ];

    AppState.filteredPrograms = [...AppState.programs];
    displayPrograms();
    addProgramMarkers();
}

// ===========================
// Program Markers
// ===========================
function addProgramMarkers() {
    // Clear existing markers
    AppState.markers.forEach(marker => marker.remove());
    AppState.markers = [];

    // Add markers for filtered programs
    AppState.filteredPrograms.forEach(program => {
        const marker = L.marker([program.lat, program.lng], {
            icon: createCustomIcon()
        });

        // Create popup content
        const popupContent = createPopupContent(program);
        marker.bindPopup(popupContent);

        // Add click handler
        marker.on('click', () => {
            highlightProgramCard(program.id);
        });

        marker.addTo(AppState.map);
        AppState.markers.push(marker);
    });

    // Fit map to markers if there are any
    if (AppState.markers.length > 0) {
        const group = new L.featureGroup(AppState.markers);
        AppState.map.fitBounds(group.getBounds().pad(0.1));
    }
}

function createCustomIcon() {
    return L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #333333; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

function createPopupContent(program) {
    return `
        <div class="popup-content">
            <h3>${program.name}</h3>
            <p><strong>Address:</strong> ${program.address}, ${program.city}, MA ${program.zip}</p>
            <p><strong>County:</strong> ${program.county}</p>
            <p><strong>Phone:</strong> ${program.phone}</p>
            <p><strong>Email:</strong> ${program.email}</p>
            <p><strong>Services:</strong> ${program.services}</p>
            <p><strong>Age Range:</strong> ${program.ageRange}</p>
            <p><strong>Capacity:</strong> ${program.capacity} students</p>
        </div>
    `;
}

// ===========================
// Display Programs List
// ===========================
function displayPrograms() {
    const programsList = document.getElementById('programsList');
    const resultsCount = document.getElementById('resultsCount');

    resultsCount.textContent = AppState.filteredPrograms.length;
    programsList.innerHTML = '';

    if (AppState.filteredPrograms.length === 0) {
        programsList.innerHTML = '<p style="color: #64748b; text-align: center; padding: 1rem;">No programs found</p>';
        return;
    }

    AppState.filteredPrograms.forEach(program => {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.dataset.programId = program.id;
        card.innerHTML = `
            <h4>${program.name}</h4>
            <p>${program.city}, ${program.county} County</p>
            <p>${program.services}</p>
        `;

        card.addEventListener('click', () => {
            const marker = AppState.markers.find(m =>
                m.getLatLng().lat === program.lat &&
                m.getLatLng().lng === program.lng
            );
            if (marker) {
                AppState.map.setView([program.lat, program.lng], 14);
                marker.openPopup();
            }
        });

        programsList.appendChild(card);
    });
}

function highlightProgramCard(programId) {
    // Remove previous highlights
    document.querySelectorAll('.program-card').forEach(card => {
        card.style.borderColor = '';
        card.style.backgroundColor = '';
    });

    // Highlight selected card
    const card = document.querySelector(`[data-program-id="${programId}"]`);
    if (card) {
        card.style.borderColor = '#333333';
        card.style.backgroundColor = '#f5f5f5';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ===========================
// Search and Filter
// ===========================
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const countyFilter = document.getElementById('countyFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;

    AppState.filteredPrograms = AppState.programs.filter(program => {
        // Search filter
        const matchesSearch = searchTerm === '' ||
            program.name.toLowerCase().includes(searchTerm) ||
            program.city.toLowerCase().includes(searchTerm) ||
            program.zip.includes(searchTerm) ||
            program.services.toLowerCase().includes(searchTerm);

        // County filter
        const matchesCounty = countyFilter === '' || program.county === countyFilter;

        // Region filter
        const matchesRegion = regionFilter === '' || program.region === regionFilter;

        return matchesSearch && matchesCounty && matchesRegion;
    });

    displayPrograms();
    addProgramMarkers();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('countyFilter').value = '';
    document.getElementById('regionFilter').value = '';
    applyFilters();
}


// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Search
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
    });

    // Filters
    document.getElementById('countyFilter').addEventListener('change', applyFilters);
    document.getElementById('regionFilter').addEventListener('change', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
}
