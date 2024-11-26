from flask import Flask, jsonify, request  
from flask_mysqldb import MySQL  
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  # Додайте CORS для роботи з JavaScript

# Налаштування MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Змініть на вашого користувача MySQL
app.config['MYSQL_PASSWORD'] = '22597612Uliana'  # Змініть на ваш пароль MySQL
app.config['MYSQL_DB'] = 'library'  # Змініть на назву вашої бази даних

mysql = MySQL(app)

# Перетворення результату в JSON формат
def format_books(books):
    return [
        {
            'id': book[0],           # ID книги
            'title': book[1],        # Назва книги
            'author_id': book[2],    # ID автора
            'genre_id': book[3],     # ID жанру
            'year': book[4],         # Рік
            'description': book[5],  # Опис
            'location': book[6],     # Місцезнаходження
            'genre': book[7],        # Жанр
            'is_read': book[8]       # Статус прочитання
        }
        for book in books
    ]

# Отримати всі книги
@app.route('/api/books', methods=['GET'])
def get_books():
    cur = mysql.connection.cursor()
    cur.execute('SELECT b.id, b.title, b.author_id, b.genre_id, b.year, b.description, b.location, b.genre, b.is_read FROM books b')
    books = cur.fetchall()
    cur.close()
    
    # Повертаємо список книг у форматі JSON
    return jsonify(format_books(books))

# Пошук книг за назвою
@app.route('/api/books/search', methods=['GET'])
def search_books():
    query = request.args.get('query', '')
    cur = mysql.connection.cursor()
    cur.execute(
        'SELECT b.id, b.title, b.author_id, b.genre_id, b.year, b.description, b.location, b.genre, b.is_read '
        'FROM books b WHERE b.title LIKE %s', 
        ('%' + query + '%',)
    )
    books = cur.fetchall()
    cur.close()

    return jsonify(format_books(books))

@app.route('/api/books/searchByGenre', methods=['GET'])
def search_books_by_genre():
    genre_id = request.args.get('genreId')  # Get genre ID from query string

    # Check if genre ID is provided
    if not genre_id:
        return jsonify({'message': 'Missing genre ID'}), 400  # Return error if missing

    cur = mysql.connection.cursor()
    cur.execute(
        'SELECT b.id, b.title, b.author_id, b.genre_id, b.year, b.description, b.location, b.genre, b.is_read '
        'FROM books b WHERE b.genre_id = %s',
        (genre_id,)  # Use exact match for genre ID
    )
    books = cur.fetchall()
    cur.close()

    return jsonify(format_books(books))

# Додати нову книгу
@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.get_json()
    title = data.get('title')
    author_id = data.get('author_id')
    genre_id = data.get('genre_id')
    year = data.get('year')
    description = data.get('description')
    location = data.get('location')
    genre = data.get('genre')  # Додано поле для жанру, якщо є
    is_read = data.get('is_read', 0)  # Статус прочитання (0 за замовчуванням)

    if not title or not author_id or not genre_id:
        return jsonify({'message': 'Missing required fields'}), 400
    
    cur = mysql.connection.cursor()
    cur.execute(
        'INSERT INTO books (title, author_id, genre_id, year, description, location, genre, is_read) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
        (title, author_id, genre_id, year, description, location, genre, is_read)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Book added successfully!'}), 201

if __name__ == '__main__':
    app.run(port=8000, debug=True) 