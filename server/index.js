require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = 'https://www.omdbapi.com';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));

// Search movies
app.get('/api/search', async (req, res) => {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ error: 'query param is required' });
    try {
        const { data } = await axios.get(OMDB_BASE, {
            params: { s: query, page, apikey: API_KEY, type: 'movie' },
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from OMDb', details: err.message });
    }
});

// Get movie details by IMDb ID
app.get('/api/movie/:imdbID', async (req, res) => {
    const { imdbID } = req.params;
    try {
        const { data } = await axios.get(OMDB_BASE, {
            params: { i: imdbID, plot: 'full', apikey: API_KEY },
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from OMDb', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Proxy server running on http://localhost:${PORT}`);
    console.log(`   OMDb key is secured server-side.`);
});
