import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const OMDB_BASE = 'https://www.omdbapi.com';
const API_KEY = process.env.OMDB_API_KEY;

app.use(cors());
app.use(express.json());

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

export default app;
