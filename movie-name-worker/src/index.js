// Cloudflare Worker code
const ALLOWED_ORIGINS = ['https://stdmoviename.yeyeziblog.eu.org', 'https://sandy9707.github.io']; // 替换为你的域名

async function handleRequest(request, env) {
	try {
		// 处理 CORS
		if (request.method === 'OPTIONS') {
			return handleOptions(request);
		}

		// 验证来源
		const origin = request.headers.get('Origin');
		if (!ALLOWED_ORIGINS.includes(origin)) {
			return new Response('Forbidden', {
				status: 403,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		const url = new URL(request.url);
		const searchType = url.searchParams.get('type');
		let query = url.searchParams.get('query');
		const language = url.searchParams.get('language') || 'zh-CN'; // 默认使用中文

		if (!searchType || !query) {
			return new Response(JSON.stringify({ error: 'Missing parameters' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': origin,
				},
			});
		}

		// 如果查询中包含点号，替换为空格
		if (query.includes('.')) {
			query = query.replace(/\./g, ' ');
		}

		// 构建 TMDB API URL
		const tmdbUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${
			env.TMDB_API_KEY
		}&language=${language}&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

		const response = await fetch(tmdbUrl);
		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.status}`);
		}

		const data = await response.json();

		// 如果中文搜索没有结果，尝试英文搜索
		if (data.results.length === 0 && language === 'zh-CN') {
			const enResponse = await fetch(
				`https://api.themoviedb.org/3/search/${searchType}?api_key=${env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
					query
				)}&page=1&include_adult=false`
			);

			if (!enResponse.ok) {
				throw new Error(`TMDB API error: ${enResponse.status}`);
			}

			const enData = await enResponse.json();
			data.results = enData.results;
		}

		// 如果是中文搜索，获取英文标题
		if (language === 'zh-CN' && data.results.length > 0) {
			const enPromises = data.results.map(async (item) => {
				const enResponse = await fetch(
					`https://api.themoviedb.org/3/search/${searchType}?api_key=${env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
						item.title || item.name
					)}&page=1&include_adult=false`
				);
				if (!enResponse.ok) return null;
				const enData = await enResponse.json();
				return enData.results[0];
			});

			const enResults = await Promise.all(enPromises);

			// 合并中英文结果
			data.results = data.results.map((item, index) => {
				const enItem = enResults[index];
				return {
					...item,
					en_title: enItem ? enItem.title || enItem.name : '',
					release_date: item.release_date || item.first_air_date,
				};
			});
		}

		// 设置 CORS 头
		const headers = {
			'Access-Control-Allow-Origin': origin,
			'Content-Type': 'application/json',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		return new Response(JSON.stringify(data), { headers });
	} catch (error) {
		console.error('Worker error:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch data',
				message: error.message,
			}),
			{
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': origin,
					'Content-Type': 'application/json',
				},
			}
		);
	}
}

function handleOptions(request) {
	const origin = request.headers.get('Origin');

	if (!ALLOWED_ORIGINS.includes(origin)) {
		return new Response(null, { status: 403 });
	}

	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

// Export the Worker
export default {
	async fetch(request, env, ctx) {
		return handleRequest(request, env);
	},
};
