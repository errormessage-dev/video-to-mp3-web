import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setMp3Url(null);
    try {
      const res = await fetch('/.netlify/functions/yt-to-mp3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        setMp3Url(data.mp3Url);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>YouTube to MP3 Converter</h1>
      <input
        type="text"
        placeholder="Paste YouTube URL here"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: '300px', padding: '8px' }}
      />
      <button onClick={handleConvert} disabled={loading || !url} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        {loading ? 'Converting...' : 'Convert to MP3'}
      </button>
      {mp3Url && (
        <div style={{ marginTop: '20px' }}>
          <a href={mp3Url} download target="_blank" rel="noopener noreferrer">Download MP3</a>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}

export default App
