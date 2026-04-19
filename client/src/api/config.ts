export const BASE_URL = '/api';

export const fetchOptions = {
    credentials: 'include' as RequestCredentials,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    }
};





export const PAGES_URL = {
    AUTH: `/auth`,
    MAIN: `/`,
    ACCOUNT: `/profile`,
    ADMIN: '/admin',
    MOVIE: (id: number): string => `/movie/${id}`,
    MOVIES: '/movies'
}



