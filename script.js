document.addEventListener('DOMContentLoaded', function () {
    fetchBooks(); // Завантажити книги при завантаженні сторінки

    // Додавання обробника подій для пошуку книг
    document.getElementById('search-button').addEventListener('click', function () {
        const query = document.getElementById('search-query').value;
        console.log("Searching for:", query);
        searchBooks(query);
    });

    // Додавання обробника подій для форми додавання книги
    document.getElementById('add-book-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Зупинити перезавантаження сторінки
        addBook();
    });

    // Додавання обробника подій для фільтрації за жанром
    document.getElementById('genre-search-button').addEventListener('click', function () {
        const genre = document.getElementById('searchByGenre').value;
        searchByGenre(genre);
    });

});

// Функція для отримання всіх книг
function fetchBooks() {
    fetch('http://127.0.0.1:8000/api/books') // Шлях до API
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';  // Очищуємо список перед додаванням
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by Author ID: ${book.author_id} (Genre ID: ${book.genre_id}, Year: ${book.year}, Location: ${book.location})`;
                bookList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Функція для пошуку книг
function searchBooks(query) {
    fetch(`http://127.0.0.1:8000/api/books/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = ''; // Очистити попередній список
            if (data.length === 0) {
                const message = document.createElement('p');
                message.textContent = 'No books found.';
                bookList.appendChild(message);
            } else {
                data.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `${book.title} by Author ID: ${book.author_id} (Genre ID: ${book.genre_id}, Year: ${book.year}, Location: ${book.location})`;
                    bookList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error searching books:', error));
}


// Функція для пошуку книг за жанром
function searchByGenre(genreId) {
    fetch(`http://127.0.0.1:8000/api/books/searchByGenre?genreId=${encodeURIComponent(genreId)}`)
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = ''; // Очистити попередній список
            if (data.length === 0) {
                const message = document.createElement('p');
                message.textContent = 'No books found for this genre.';
                bookList.appendChild(message);
            } else {
                data.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `${book.title} by Author ID: ${book.author_id} (Genre ID: ${book.genre_id}, Year: ${book.year}, Location: ${book.location})`;
                    bookList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error searching books by genre:', error));
}


// Функція для відображення списку книг
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Очищення перед додаванням нових даних

    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by Author ID: ${book.author_id} (Genre ID: ${book.genre_id}, Year: ${book.year}, Location: ${book.location})`;
        bookList.appendChild(li);
    });
}

// Функція для додавання нової книги
function addBook() {
    const title = document.getElementById('title').value;
    const author_id = document.getElementById('author_id').value;
    const genre_id = document.getElementById('genre_id').value;
    const year = document.getElementById('year').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    
    fetch('http://127.0.0.1:8000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            author_id,
            genre_id,
            year,
            description,
            location
        }),
    })

        .then(response => {
            if (response.ok) {
                alert('Book added successfully!');
                fetchBooks(); // Оновити список книг
            } else {
                alert('Failed to add book.');
            }
        })
        .catch(error => console.error('Error adding book:', error));
}
