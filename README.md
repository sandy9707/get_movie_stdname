# Movie Standard Name Extractor

A simple web application that helps you find the standard names of movies and TV shows using The Movie Database (TMDB) API.

## Features

- Search for both movies and TV shows
- Get standardized names from TMDB database
- Simple and clean user interface
- One-click copy to clipboard
- Secure API key handling through Cloudflare Workers
- No backend required - works entirely in the browser

## Setup

### 1. Cloudflare Workers Setup

1. Create a Cloudflare account if you don't have one
2. Install Wrangler (Cloudflare Workers CLI):

   ```bash
   npm install -g wrangler
   ```

3. Login to Wrangler:

   ```bash
   wrangler login
   ```

4. Create a new Worker:

   ```bash
   wrangler init movie-name-worker
   ```

5. Copy the contents of `worker.js` to your new Worker
6. Add your TMDB API key as a secret:

   ```bash
   wrangler secret put TMDB_API_KEY
   ```

7. Update the `ALLOWED_ORIGINS` in `worker.js` with your GitHub Pages domain
8. Deploy the Worker:

   ```bash
   wrangler publish
   ```

### 2. Frontend Setup

1. Update `WORKER_URL` in `app.js` with your Cloudflare Worker URL
2. Push the code to your GitHub repository
3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Select the branch you want to deploy (usually `main`)
   - Select the root folder as the source
   - Click Save

Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Usage

1. Open the website in your browser
2. Select whether you want to search for a movie or TV show
3. Enter the name of the movie/TV show
4. Click "Search" or press Enter
5. Click on the result to copy it to your clipboard

## Security

The application uses Cloudflare Workers as a proxy to protect the TMDB API key. The API key is stored as a secret in Cloudflare Workers and is never exposed to the client. The Worker also implements CORS protection to ensure only authorized domains can access the API.

## Technologies Used

- Vue.js 3 (CDN version)
- Tailwind CSS
- TMDB API
- Cloudflare Workers
