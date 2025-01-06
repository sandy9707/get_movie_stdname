// Cloudflare Worker code
const ALLOWED_ORIGINS = ["https://yeyeziblog.eu.org"]; // 替换为你的域名

async function handleRequest(request, env) {
  // 处理 CORS
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  // 验证来源
  const origin = request.headers.get("Origin");
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const searchType = url.searchParams.get("type");
  const query = url.searchParams.get("query");
  const language = url.searchParams.get("language") || "zh-CN"; // 默认使用中文

  if (!searchType || !query) {
    return new Response("Missing parameters", { status: 400 });
  }

  // 构建 TMDB API URL
  const tmdbUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${
    env.TMDB_API_KEY
  }&language=${language}&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    // 如果中文搜索没有结果，尝试英文搜索
    if (data.results.length === 0 && language === "zh-CN") {
      const enResponse = await fetch(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${
          env.TMDB_API_KEY
        }&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false`
      );
      const enData = await enResponse.json();
      data.results = enData.results;
    }

    // 设置 CORS 头
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    return new Response(JSON.stringify(data), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json",
      },
    });
  }
}

function handleOptions(request) {
  const origin = request.headers.get("Origin");

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Export the Worker
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};
