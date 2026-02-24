const axios = require('axios'); // تم تصحيح حرف الـ c

export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'query required' });

    try {
        const response = await axios.get('https://www.pinterest.com/resource/BaseSearchResource/get/', {
            params: {
                source_url: `/search/pins/?q=${encodeURIComponent(q)}`,
                data: JSON.stringify({
                    options: {
                        query: q,
                        scope: 'pins',
                        page_size: 25
                    }
                })
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*, q=0.01',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.pinterest.com/',
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 15000
        });

        const results = response.data?.resource_response?.data?.results || [];
        const images = results
            .map(pin => pin?.images?.orig?.url || pin?.images?.['736x']?.url)
            .filter(Boolean);

        res.status(200).json({ images, count: images.length });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
