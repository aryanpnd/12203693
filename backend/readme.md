# URL Shortener Microservice

A production-ready Node.js Express microservice for URL shortening with analytics and comprehensive logging.

## API Endpoints

### 1. Create Short URL

**POST** `/shorturls`

```json
{
  "url": "https://example.com/very/long/path",
  "validity": 30,
  "shortcode": "custom123"
}
```

**Response (201):**
```json
{
  "shortLink": "http://localhost:8000/custom123",
  "expiry": "2025-01-01T00:30:00Z"
}
```

### 2. Redirect to Original URL

**GET** `/:shortcode`

Redirects to the original URL and tracks click metadata.

### 3. Get Statistics

**GET** `/shorturls/:shortcode`

**Response:**
```json
{
  "originalUrl": "https://example.com/very/long/path",
  "shortcode": "custom123",
  "createdAt": "2025-01-01T00:00:00Z",
  "expiry": "2025-01-01T00:30:00Z",
  "clicks": 5,
  "clickData": [
    {
      "timestamp": "2025-01-01T00:05:00Z",
      "referrer": "https://google.com",
      "location": "India"
    }
  ]
}
```

### 4. Health Check

**GET** `/health`

Returns service health status.


## Testing with Postman

### 1. Create Short URL
```
POST http://localhost:8000/shorturls
Content-Type: application/json

{
  "url": "https://www.google.com",
  "validity": 60,
  "shortcode": "google"
}
```

### 2. Test Redirect
```
GET http://localhost:8000/google
```

### 3. Get Statistics
```
GET http://localhost:8000/shorturls/google
```
## License

MIT