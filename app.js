const WORKER_URL = "https://movie-name-worker.yeyezi.workers.dev"; // Worker URL
const LANGUAGE = "zh-CN"; // 默认使用中文
const TMDB_BASE_URL = "https://www.themoviedb.org"; // TMDB 基础 URL

const { createApp, ref } = Vue;

createApp({
  setup() {
    const searchQuery = ref("");
    const searchType = ref("movie");
    const results = ref([]);
    const loading = ref(false);
    const error = ref("");

    async function search() {
      if (!searchQuery.value.trim()) {
        error.value = "请输入搜索内容";
        return;
      }

      loading.value = true;
      error.value = "";
      results.value = [];

      try {
        // 构建查询参数
        const params = new URLSearchParams({
          type: searchType.value,
          query: searchQuery.value,
          language: LANGUAGE,
        });

        const response = await fetch(`${WORKER_URL}?${params.toString()}`, {
          headers: {
            Origin: "https://yeyeziblog.eu.org",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.message || data.error);
        }

        if (data.results && data.results.length > 0) {
          // 为每个结果添加 copied 标志
          results.value = data.results.map((item) => ({
            ...item,
            copied: false,
          }));
        } else {
          error.value = "未找到相关结果";
        }
      } catch (err) {
        console.error("Search error:", err);
        error.value = err.message || "搜索失败，请稍后重试";
      } finally {
        loading.value = false;
      }
    }

    function formatStandardName(item) {
      const chineseTitle = item.name || item.title;
      const englishTitle =
        item.en_title || item.original_name || item.original_title;
      const year = (item.release_date || item.first_air_date || "").split(
        "-"
      )[0];

      // 移除所有空格，并用点替换
      const formattedChinese = chineseTitle.replace(/\s+/g, "");
      const formattedEnglish = englishTitle.replace(/\s+/g, ".");

      return `${formattedChinese}.${formattedEnglish}.${year}`;
    }

    function getTMDBLink(item) {
      const type = item.first_air_date ? "tv" : "movie";
      return `${TMDB_BASE_URL}/${type}/${item.id}`;
    }

    async function copyToClipboard(item) {
      try {
        const textToCopy = formatStandardName(item);
        await navigator.clipboard.writeText(textToCopy);

        // 设置复制成功标志
        item.copied = true;
        setTimeout(() => {
          item.copied = false;
        }, 2000);
      } catch (err) {
        error.value = "复制失败";
      }
    }

    return {
      searchQuery,
      searchType,
      results,
      loading,
      error,
      search,
      copyToClipboard,
      getTMDBLink,
    };
  },
}).mount("#app");
