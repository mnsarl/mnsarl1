document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // تحميل الأفلام
    loadMovies();

    // إضافة مستمعات الأحداث
    document.getElementById('add-movie-btn').addEventListener('click', openAddModal);
    document.getElementById('movie-form').addEventListener('submit', handleMovieSubmit);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // إغلاق النافذة المنبثقة
    const closeButtons = document.querySelectorAll('.close, .secondary-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
});

// تحميل الأفلام
function loadMovies() {
    const movies = JSON.parse(localStorage.getItem('movies') || '[]');
    const moviesList = document.getElementById('movies-list');
    
    moviesList.innerHTML = movies.map((movie, index) => `
        <tr>
            <td><img src="${movie.poster}" alt="${movie.title}"></td>
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${getCategoryName(movie.category)}</td>
            <td>${new Date(movie.dateAdded).toLocaleDateString('ar-EG')}</td>
            <td>
                <button onclick="editMovie(${index})" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteMovie(${index})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// فتح نافذة الإضافة
function openAddModal() {
    document.getElementById('modal-title').textContent = 'إضافة فيلم جديد';
    document.getElementById('movie-form').reset();
    document.getElementById('movie-modal').style.display = 'block';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}

// معالجة تقديم النموذج
function handleMovieSubmit(e) {
    e.preventDefault();
    
    const movieData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        poster: document.getElementById('poster').value,
        video: document.getElementById('video').value,
        category: document.getElementById('category').value,
        year: document.getElementById('year').value,
        dateAdded: new Date().toISOString()
    };

    let movies = JSON.parse(localStorage.getItem('movies') || '[]');
    movies.push(movieData);
    localStorage.setItem('movies', JSON.stringify(movies));

    closeModal();
    loadMovies();
}

// حذف فيلم
function deleteMovie(index) {
    if (confirm('هل أنت متأكد من حذف هذا الفيلم؟')) {
        let movies = JSON.parse(localStorage.getItem('movies') || '[]');
        movies.splice(index, 1);
        localStorage.setItem('movies', JSON.stringify(movies));
        loadMovies();
    }
}

// تحرير فيلم
function editMovie(index) {
    const movies = JSON.parse(localStorage.getItem('movies') || '[]');
    const movie = movies[index];
    
    document.getElementById('modal-title').textContent = 'تعديل الفيلم';
    document.getElementById('title').value = movie.title;
    document.getElementById('description').value = movie.description;
    document.getElementById('poster').value = movie.poster;
    document.getElementById('video').value = movie.video;
    document.getElementById('category').value = movie.category;
    document.getElementById('year').value = movie.year;
    
    document.getElementById('movie-modal').style.display = 'block';
}

// تسجيل الخروج
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// تحويل رمز التصنيف إلى اسم
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