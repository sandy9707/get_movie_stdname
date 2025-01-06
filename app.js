const WORKER_URL = "https://movie-name-worker.yeyezi.workers.dev"; // Worker URL

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
        const searchUrl = `${WORKER_URL}?type=${searchType.value}&query=${encodeURIComponent(
          searchQuery.value
        )}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          // 为每个结果添加 copied 标志
          results.value = data.results.map(item => ({
            ...item,
            copied: false
          }));
        } else {
          error.value = "未找到相关结果";
        }
      } catch (err) {
        error.value = "搜索失败，请稍后重试";
      } finally {
        loading.value = false;
      }
    }

    async function copyToClipboard(item) {
      try {
        const textToCopy = item.title || item.name;
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
    };
  },
}).mount("#app");
