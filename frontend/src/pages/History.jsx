import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/history');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Conversion History</h1>
      {loading ? (
        <p className="text-center">Loading history...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 font-bold text-lg">File Name</th>
              <th className="py-3 px-6 bg-gray-200 font-bold text-lg">Converted To</th>
              <th className="py-3 px-6 bg-gray-200 font-bold text-lg">Download</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-6">{entry.fileName}</td>
                  <td className="py-3 px-6">{entry.format}</td>
                  <td className="py-3 px-6">
                    <a
                      href={entry.downloadUrl}
                      className="text-blue-500 font-bold hover:underline"
                      download
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-6 text-center">
                  No conversion history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
