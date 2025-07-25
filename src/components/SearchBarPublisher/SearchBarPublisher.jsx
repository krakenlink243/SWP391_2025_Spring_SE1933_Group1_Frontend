import React, { useState, useEffect } from 'react';
import './SearchBarPublisher.css';

function SearchBarPublisher({ onSearch, delay = 300, placeholder = "Search by name..." }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, delay);
    return () => clearTimeout(handler);
  }, [input]);

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder={placeholder}
      className="search-bar-publisher-input"
    />
  );
}

export default SearchBarPublisher;

