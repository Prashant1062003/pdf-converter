import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('docx');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDownloadLink(response.data.downloadUrl);
    } catch (err) {
      setError('Failed to convert file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PDF to {format.toUpperCase()} Converter</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="file" className="block text-lg font-medium mb-2">
            Select a PDF file
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-lg"
            accept="application/pdf"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="format" className="block text-lg font-medium mb-2">
            Select output format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {downloadLink && (
          <div className="mt-4">
            <a
              href={downloadLink}
              download
              className="block bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-green-600"
            >
              Download Converted File
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default Home;
