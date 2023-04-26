interface Article {
    urlToImage: string;
    url: string;
    title: string;
    description: string;
}

export const createTemplateHtml = (
    thumbnailImage: string,
    summary: string,
    articles: Article[],
    keyword: string
): string => {
    const template = `<!DOCTYPE html>
<html>

<head>
<style>
        /* Reset some default styles for cross-browser consistency */
        body,
        img,
        p,
        table {
            margin: 0;
            padding: 0;
        }

        /* Set font styles */
        body {
            margin-top: 20px;
            font-family: Arial, sans-serif;
            color: #333;
        }

        /* Set max width for the template */
        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        /* Style for header section */
        .header {
            display: flex;
            flex-direction: row;
            /* align-items: center; */
            background-color: #f0f0f0;
        }

        .header .image-container {
            position: relative;
        }

        .header img {
            width: 280px;
            margin-right: 20px;
            max-width: 100%;
            height: 200px;
        }

        .header h1 {
            margin: auto;
            width: 300px;
            word-wrap: break-word;
            margin-left: 20px;
            color: black;
        }

        /* Style for short content section */
        .short-content {
            padding: 20px;
            background-color: #fff;
        }

        .short-content p {
            margin-bottom: 20px;
        }

        /* Style for article list section */
        .article-list {
            padding: 20px;
            background-color: #f0f0f0;
        }

        .article-list ul {
            width: 100%;
            list-style-type: none;
            padding: 0;
        }

        .article-list li {
            width: 100%;
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .article-list li div {
            width: 100%;
        }

        .article-list li h3 {
            margin-bottom: 8px;
        }

        
        .article-list li p {
            width: 80%;
            word-wrap: break-word;
        }

        .article-list img {

            margin-top: auto;
            margin-bottom: auto;
            width: 160px;
            height: 100px;
            object-fit: fill;
            margin-right: 15px;
        }

        .article-list a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="image-container">

                <div class="image-wrapper">
                </div>

                <img src=${thumbnailImage}
                    alt="Newsletter Header">
            </div>
            <h1>Top news related to ${keyword} this week</h1>
        </div>

        <!-- Short Content Section -->
        <div class="short-content">
            <p>${summary}</p>
        </div>

        <!-- Article List Section -->
        <div class="article-list">
            <h2>Featured Articles</h2>
            <ul>
                ${articles.map((article) => {
                    return `<li>
                        <img src=${article.urlToImage}
                            alt="Article 2 Thumbnail">
                        <div>
                            <h3><a href=${article.url}>${article.title}</a></h3>
                            <p>${article.description}</p>
                        </div>
                    </li>`;
                })}
            </ul>
        </div>
    </div>
</body>

</html>`;
    return template;
};
