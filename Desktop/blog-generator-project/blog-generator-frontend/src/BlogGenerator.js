// src/BlogGenerator.js

import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Library to render Markdown

// Set the API URL to your FastAPI backend
// const API_URL = 'http://localhost:8000/generate-blog'; 
const API_URL = `${process.env.REACT_APP_API_URL}/generate-blog`; 
console.log(API_URL);


function BlogGenerator() {
  const [prompt, setPrompt] = useState('');
  const [blog, setBlog] = useState('');
  const [lang, setLang] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBlog('');
    setError(null);

    try {
      // Send the prompt to the FastAPI backend
      // console.log(prompt, lang);
      
      const response = await axios.post(API_URL, { topic:prompt, language:lang });
      
      // // The response.data.blog_content contains the formatted Markdown blog
      setBlog(response.data.blog_content);
    } catch (err) {
      console.error(err);
      // Display the generic error message or the detailed one from the backend
      setError(err.response?.data?.detail || 'Failed to generate blog. Check the backend server logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>🤖 AI Blog Generator Platform</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your blog topic, e.g., 'The Future of Quantum Computing and its impact on everyday life'"
          rows="4"
          style={{ width: '100%', marginBottom: '10px' }}
          required
        />
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value={'english'}>English</option>
          <option value={'hindi'}>Hindi</option>
          <option value={'kannada'}>Kannada</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating (This may take a minute or more...)' : 'Generate 1000-Word Blog'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
      
      {/* Display the generated blog in a formatted view using ReactMarkdown */}
      {blog && (
        <div style={{ marginTop: '30px', borderTop: '2px solid #ccc', paddingTop: '20px', textAlign: 'left' }}>
          <h2>✅ Generated Blog Post</h2>
          <ReactMarkdown>{blog}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default BlogGenerator;