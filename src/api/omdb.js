import axios from 'axios';

const api = axios.create({
    baseURL: '',
    timeout: 10000,
});

export const searchMovies = async (query, page = 1) => {
    const { data } = await api.get(`/api/search`, { params: { query, page } });
    return data;
};

export const getMovieDetails = async (imdbID) => {
    const { data } = await api.get(`/api/movie/${imdbID}`);
    return data;
};
