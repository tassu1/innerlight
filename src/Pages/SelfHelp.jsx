import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/SelfHelp.css";

const SelfHelp = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("self help");

  // ✅ Modified to accept a search term
  const fetchBooks = async (searchTerm = "self help") => {
    try {
      const res = await axios.get(`https://gutendex.com/books/?search=${searchTerm}`);
      setBooks(res.data.results.slice(0, 10)); // limit to top 10 results
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks(query);
  }, []);

  // ✅ Pass current query explicitly
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(query);
  };

  return (
    <>
      

      <div className="selfhelp-container">
        <h2>📚 Self-Help Library</h2>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search wellness topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="books-list">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={
                  book.formats["image/jpeg"] ||
                  "https://via.placeholder.com/150x200?text=No+Cover"
                }
                alt={book.title}
              />
              <div>
                <h4>{book.title}</h4>
                <p>{book.authors?.[0]?.name || "Unknown Author"}</p>

                <div className="book-links">
                  {book.formats["text/html"] && (
                    <a
                      href={book.formats["text/html"]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📖 Read Online
                    </a>
                  )}
                  {book.formats["application/epub+zip"] && (
                    <a
                      href={book.formats["application/epub+zip"]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📘 EPUB
                    </a>
                  )}
                  {book.formats["application/x-mobipocket-ebook"] && (
                    <a
                      href={book.formats["application/x-mobipocket-ebook"]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📱 MOBI
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

 
    </>
  );
};

export default SelfHelp;
