const WORKER_URL = "https://your-worker.your-subdomain.workers.dev"; // 替换为你的 Worker URL
const LANGUAGE = "en-US";

const { createApp, ref } = Vue;

createApp({
  setup() {
    const searchQuery = ref("");
    const searchType = ref("movie");
    const result = ref("");
    const loading = ref(false);
    const error = ref("");
    const copied = ref(false);

    async function searchTMDB(query, type) {
      const searchUrl = `${WORKER_URL}?type=${type}&query=${encodeURIComponent(
        query
      )}&language=${LANGUAGE}&page=1`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return type === "movie" ? item.title : item.name;
      }
      throw new Error("No results found");
    }

    async function search() {
      if (!searchQuery.value.trim()) {
        error.value = "Please enter a search term";
        return;
      }

      loading.value = true;
      error.value = "";
      result.value = "";
      copied.value = false;

      try {
        result.value = await searchTMDB(searchQuery.value, searchType.value);
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    }

    async function copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        error.value = "Failed to copy to clipboard";
      }
    }

    return {
      searchQuery,
      searchType,
      result,
      loading,
      error,
      copied,
      search,
      copyToClipboard,
    };
  },
}).mount("#app");
