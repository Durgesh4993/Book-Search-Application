import React, { useState, useEffect } from 'react';

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [bookshelf, setBookshelf] = useState([]);
    const [loading, setLoading] = useState(false); // State to track loading status

    useEffect(() => {
        const storedBookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
        setBookshelf(storedBookshelf);
    }, []);

    const handleInputChange = async (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 2) {
            // Start loading when search starts
            setLoading(true);

            try {
                const response = await fetch(`https://openlibrary.org/search.json?q=${value}&limit=10&page=1`);
                const data = await response.json();
                setResults(data.docs);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // Reset loading when search completes
                setLoading(false);
            }
        } else {
            setResults([]);
        }
    };

    const addToBookshelf = (book) => {
        const newBookshelf = [...bookshelf, book];
        setBookshelf(newBookshelf);
        localStorage.setItem('bookshelf', JSON.stringify(newBookshelf));
    };

    const removeFromBookshelf = (book) => {
        const updatedBookshelf = bookshelf.filter(item => item.key !== book.key);
        setBookshelf(updatedBookshelf);
        localStorage.setItem('bookshelf', JSON.stringify(updatedBookshelf));
    };

    return (
        <div className="book-search">
            <h1>Book Search</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for books..."
                    value={query}
                    onChange={handleInputChange}
                />
                {/* Disable the button when loading */}
                <button className="search-button" disabled={loading} onClick={handleInputChange}>Search</button>
                {/* Show loader when loading state is true */}
                {loading && (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </div>
            <div className="results">
                {results.map(book => (
                    <div key={book.key} className="book-card">
                        <h2>{book.title}</h2>
                        <h3>{book.author_name?.join(', ')}</h3>
                        <p>{book.first_publish_year}</p>
                        <button onClick={() => addToBookshelf(book)}>Add to Bookshelf</button>
                    </div>
                ))}
            </div>
            <h2>Your Bookshelf</h2>
            <div className="bookshelf">
                {bookshelf.map(book => (
                    <div key={book.key} className="book-card">
                        <h2>{book.title}</h2>
                        <h3>{book.author_name?.join(', ')}</h3>
                        <p>{book.first_publish_year}</p>
                        <button onClick={() => removeFromBookshelf(book)}>Remove from Bookshelf</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookSearch;
