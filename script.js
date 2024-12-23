document.addEventListener('DOMContentLoaded', function() {
    // جلب الأفلام من الملف المحلي
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            displayMovies(movies);
        })
        .catch(error => console.error('Error:', error));

    // البحث والتصفية
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');

    searchInput.addEventListener('input', filterMovies);
    categoryFilter.addEventListener('change', filterMovies);
});

// عرض الأفلام
function displayMovies(movies) {
    const moviesGrid = document.querySelector('.movies-grid');
    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card fade-in">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-overlay">
                    <a href="#" class="watch-btn" onclick="openVideoModal('${movie.videoId}'); return false;">
                        <i class="fas fa-play"></i>
                        مشاهدة الفيلم
                    </a>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span><i class="fas fa-calendar"></i> ${movie.year}</span>
                    <span><i class="fas fa-tag"></i> ${getCategoryName(movie.category)}</span>
                </div>
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    <span>${movie.rating}</span>
                    <span class="rating-count">(${movie.ratingsCount})</span>
                </div>
                <p class="movie-description">${movie.description}</p>
            </div>
        </div>
    `).join('');
}

// تصفية الأفلام
function filterMovies() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;

    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const filteredMovies = movies.filter(movie => {
                const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
                const matchesCategory = selectedCategory === '' || movie.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });
            displayMovies(filteredMovies);
        })
        .catch(error => console.error('Error:', error));
}

function getCategoryName(category) {
    const categories = {
        'action': 'أكشن',
        'comedy': 'كوميدي',
        'drama': 'دراما',
        'horror': 'رعب',
        'anime': 'أنمي'
    };
    return categories[category] || category;
}

function openVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="close-video" onclick="closeVideoModal()">&times;</span>
            <iframe
                src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
        document.body.classList.remove('modal-open');
    }
} 