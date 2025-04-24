
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';


function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('None');
  const token = import.meta.env.VITE_HF_TOKEN;


  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl('');

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        { inputs: style !== 'None' ? `${style} style of ${prompt}` : prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          responseType: 'blob', // important!
        }
      );

      const imageBlob = response.data;
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Something went wrong. Try again!');
    }

    setLoading(false);
  };

  const downloadImage = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'ai-image.png'; // You can change the file name if needed
      a.click();
    }
  };
  

  return (
    <div className="app">
      <header style={{ textAlign: 'right', padding: '0.5rem' }}>
      <button className='modechange' onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </header>
      <img src="/logoa.png" alt="Logo" className="logo" />
      <h1>AI Artist</h1>
      <h5>"Turn words into stunning art — instantly."✨🎉</h5>
     

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="None">None</option>
        <option value="Anime">Anime</option>
        <option value="Cyberpunk">Cyberpunk</option>
        <option value="Pixel art">Pixel Art</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Realistic">Realistic</option>
      </select>

      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      

      {imageUrl && (
  <>
    <img src={imageUrl} alt="AI Generated" />
    <button className='download' onClick={downloadImage}>Download Image</button>
    
  </>
)}


<p>&copy; Created By Rohit singh</p>


    </div>
  );
}

export default App;
