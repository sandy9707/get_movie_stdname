import requests
import re
import os
from pathlib import Path
import json
import pandas as pd


def get_script_dir():
    """Get the directory where the current Python script is located."""
    if "__file__" in globals():
        script_path = Path(os.path.abspath(__file__)).resolve().parent
    else:
        script_path = Path.cwd()
    return script_path


def create_directory_if_not_exists(directory):
    """Check if the directory exists; create it if it doesn't."""
    if not directory.exists():
        directory.mkdir(parents=True, exist_ok=True)


# load the data from the data directory
# files = list(data_dir.glob("*.txt"))
# for file in files:
#     print(file)
# file = files[0]
# with open(file, "r", encoding="utf-8") as f:
#     data = f.read()
#     data = data.split("\n")

proxy = "10.9.65.32:7890"
proxies = {
    "http": "http://%(proxy)s/" % {"proxy": proxy},
    "https": "http://%(proxy)s/" % {"proxy": proxy},
}
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZmQwZTUxNjE1OWU3YWI1MjQ3ZTk5MGYzMmFmNjE5MyIsInN1YiI6IjY0YjY2YWY3Mzc4MDYyMDBmZjNhNjY0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YKJqwX13DAxSBCSmbR0kGb-ji8fmcF9TUKE7KnsaqUQ",
    "accept": "application/json",
}
# api_key = config.tmdb_api_key  # get TMDB API key from config.py file


def get_highest_revenue_films(query, language, api_key):
    response = requests.get(
        url=f"https://api.themoviedb.org/3/search/movie?query={query}&api_key={api_key}&language={language}",
        proxies=proxies,
        headers=headers,
    )
    highest_revenue = response.json()  # store parsed json response
    highest_revenue_films = highest_revenue["results"][0]
    return highest_revenue_films["title"], highest_revenue_films["release_date"]


def get_combined_title(query, language, api_key):
    if "." in query:
        query = re.sub("\.", " ", query)
    title, release_date = get_highest_revenue_films(query, language, api_key)
    chinese_title = get_highest_revenue_films(query, "zh-CN", api_key)[0]
    return f"{chinese_title.replace(' ', '.')}.{title.replace(' ', '.')}.{release_date.split('-')[0]}"


def get_highest_revenue_tvs(query, language, api_key):
    response = requests.get(
        url=f"https://api.themoviedb.org/3/search/tv?query={query}&api_key={api_key}&language={language}",
        proxies=proxies,
        headers=headers,
    )
    highest_revenue = response.json()  # store parsed json response
    highest_revenue_tvs = highest_revenue["results"][0]
    return highest_revenue_tvs["name"], highest_revenue_tvs["first_air_date"]


def get_combined_title_tvs(query, language, api_key):
    if "." in query:
        query = re.sub("\.", " ", query)
    title, release_date = get_highest_revenue_tvs(query, language, api_key)
    chinese_title = get_highest_revenue_tvs(query, "zh-CN", api_key)[0]
    return f"{chinese_title.replace(' ', '.')}.{title.replace(' ', '.')}.{release_date.split('-')[0]}"


if __name__ == "__main__":
    script_dir = get_script_dir()
    results_dir = script_dir / "results"
    data_dir = script_dir / "data"
    create_directory_if_not_exists(results_dir)
    create_directory_if_not_exists(data_dir)

    # Usage:
    api_key = "2fd0e516159e7ab5247e990f32af6193"
    language = "en-US"
    query = "The.Pig.the.Snake.and.the.Pigeon"
    result = {}
    for query in data:
        combined_title = get_combined_title(query, language, api_key)
        print(combined_title)
        result[query] = combined_title

    with open(results_dir / "result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=4)
