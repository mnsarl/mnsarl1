document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    // جلب بيانات الفيلم
    fetch(`/api/movies/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('movie-year').innerHTML = `<i class="fas fa-calendar"></i> ${movie.year}`;
            document.getElementById('movie-category').innerHTML = `<i class="fas fa-tag"></i> ${getCategoryName(movie.category)}`;
            document.getElementById('movie-description').textContent = movie.description;
            document.getElementById('movie-rating').textContent = movie.rating || '0';
            document.getElementById('ratings-count').textContent = `(${movie.ratingsCount || 0} تقييم)`;

            // تحديث مصدر الفيديو
            const video = document.querySelector('#player');
            video.src = movie.videoPath;

            // إعداد مشغل الفيديو
            const player = new Plyr('#player', {
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'settings',
                    'fullscreen'
                ]
            });

            // تحميل التعليقات
            loadComments(movieId);
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'index.html';
        });

    // نظام التقييم
    const stars = document.querySelectorAll('.stars i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            submitRating(movieId, rating);
        });

        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            updateStars(rating);
        });
    });

    document.querySelector('.stars').addEventListener('mouseleave', function() {
        updateStars(getCurrentRating());
    });

    // نموذج التعليقات
    document.getElementById('comment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const comment = this.comment.value;
        submitComment(movieId, comment);
        this.reset();
    });
});

// تحديث نجوم التقييم
function updateStars(rating) {
    document.querySelectorAll('.stars i').forEach(star => {
        const starRating = star.dataset.rating;
        star.classList.remove('fas', 'far');
        star.classList.add(starRating <= rating ? 'fas' : 'far');
    });
}

// إرسال تقييم
async function submitRating(movieId, rating) {
    try {
        const response = await fetch(`/api/movies/${movieId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('movie-rating').textContent = data.newRating;
            document.getElementById('ratings-count').textContent = `(${data.ratingsCount} تقييم)`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// إرسال تعليق
async function submitComment(movieId, text) {
    try {
        const response = await fetch(`/api/movies/${movieId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (response.ok) {
            loadComments(movieId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// تحميل التعليقات
async function loadComments(movieId) {
    try {
        const response = await fetch(`/api/movies/${movieId}/comments`);
        const comments = await response.json();
        
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.username}</span>
                    <span class="comment-date">${new Date(comment.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
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