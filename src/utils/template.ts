export interface Article {
    urlToImage: string;
    url: string;
    title: string;
    description: string;
    [key: string]: string;
}

export const createTemplateHtml = (
    thumbnailImage: string,
    summary: string,
    articles: Article[],
    keyword: string
): string => {
    //     const template = `<!DOCTYPE html>
    // <html>

    // <head>
    // <style>
    //         /* Reset some default styles for cross-browser consistency */
    //         body,
    //         img,
    //         p,
    //         table {
    //             margin: 0;
    //             padding: 0;
    //         }

    //         /* Set font styles */
    //         body {
    //             margin-top: 20px;
    //             font-family: Arial, sans-serif;
    //             color: #333;
    //         }

    //         /* Set max width for the template */
    //         .container {
    //             max-width: 600px;
    //             margin: 0 auto;
    //         }

    //         /* Style for header section */
    //         .header {
    //             display: flex;
    //             flex-direction: row;
    //             /* align-items: center; */
    //             background-color: #f0f0f0;
    //         }

    //         .header .image-container {
    //             position: relative;
    //         }

    //         .header img {
    //             width: 280px;
    //             margin-right: 20px;
    //             max-width: 100%;
    //             height: 200px;
    //         }

    //         .header h1 {
    //             margin: auto;
    //             width: 300px;
    //             word-wrap: break-word;
    //             margin-left: 20px;
    //             color: black;
    //         }

    //         /* Style for short content section */
    //         .short-content {
    //             padding: 20px;
    //             background-color: #fff;
    //         }

    //         .short-content p {
    //             margin-bottom: 20px;
    //         }

    //         /* Style for article list section */
    //         .article-list {
    //             padding: 20px;
    //             background-color: #f0f0f0;
    //         }

    //         .article-list ul {
    //             width: 100%;
    //             list-style-type: none;
    //             padding: 0;
    //         }

    //         .article-list li {
    //             width: 100%;
    //             display: flex;
    //             gap: 10px;
    //             margin-bottom: 10px;
    //         }

    //         .article-list li div {
    //             width: 100%;
    //         }

    //         .article-list li h3 {
    //             margin-bottom: 8px;
    //         }

    //         .article-list li p {
    //             width: 80%;
    //             word-wrap: break-word;
    //         }

    //         .article-list img {

    //             margin-top: auto;
    //             margin-bottom: auto;
    //             width: 160px;
    //             height: 100px;
    //             object-fit: fill;
    //             margin-right: 15px;
    //         }

    //         .article-list a {
    //             color: #007bff;
    //             text-decoration: none;
    //         }
    //     </style>
    // </head>

    // <body>
    //     <div class="container">
    //         <!-- Header Section -->
    //         <div class="header">
    //             <div class="image-container">

    //                 <div class="image-wrapper">
    //                 </div>

    //                 <img src=${thumbnailImage}
    //                     alt="Newsletter Header">
    //             </div>
    //             <h1>Top news related to ${keyword} this week</h1>
    //         </div>

    //         <!-- Short Content Section -->
    //         <div class="short-content">
    //             <p>${summary}</p>
    //         </div>

    //         <!-- Article List Section -->
    //         <div class="article-list">
    //             <h2>Featured Articles</h2>
    //             <ul>
    //                 ${articles.map((article) => {
    //                     return `<li>
    //                         <img src=${article.urlToImage}
    //                             alt="Article 2 Thumbnail">
    //                         <div>
    //                             <h3><a href=${article.url}>${article.title}</a></h3>
    //                             <p>${article.description}</p>
    //                         </div>
    //                     </li>`;
    //                 })}
    //             </ul>
    //         </div>
    //     </div>
    // </body>

    // </html>`;

    const template = `
    <!DOCTYPE html>
<html lang="en">

<head>
    
</head>

<body>
    <div
        style="max-width: 600px; min-height: 800px; margin: 0 auto; border: 2px solid black; border-radius: 10px; padding: 0px 30px">
        <h2
            style="font-family: Arial, Helvetica, sans-serif; text-align: center; font-size: 36px; max-width: 485px; margin: 36px auto;">
            Top news related to ${keyword} this week.
        </h2>
        <div style="display: flex; align-items: flex-start;">
            <img src="${thumbnailImage}"
                style="width: 256px; height: 256px; border-radius: 5px; margin-right: 15px;" />
            <p style="font-family: Arial, Helvetica, sans-serif; text-align: justify; margin: 0; font-size: 16px;">
               ${summary}
            </p>
        </div>

        <h3 style="font-family: Arial, Helvetica, sans-serif; margin-top: 36px; font-size: 24px; color: black; font-weight: bold;">FEATURED ARTICLES</h3>

        <div class="article-list" style="margin-bottom: 20px">
        ${articles.map((article, i) => {
            if (i % 2 === 0) {
                return `
                    <div style="display: flex; margin: 12px 0px;">
                    <img src="${article.urlToImage}" alt=${article.title}
                        style="max-width: 256px; border-radius: 5px; ${
                            i % 2 === 0 ? "margin-right: 15px" : "margin-left: 15px"
                        }" />
                        <div>
    
                        <h4 style="margin: 0; font-family: Arial, Helvetica, sans-serif;"><a href=${
                            article.url
                        } target="_blank">${article.title}</a></h4>
                        <p style="font-family: Arial, Helvetica, sans-serif;">${article.description}</p>
                        </div>
                    </div>
                    `;
            } else {
                return `
                    <div style="display: flex; margin: 12px 0px;">
                    <div>
                    
                    <h4 style="margin: 0; font-family: Arial, Helvetica, sans-serif;"><a href=${
                        article.url
                    } target="_blank">${article.title}</a></h4>
                    <p style="font-family: Arial, Helvetica, sans-serif;">${article.description}</p>
                    </div>
                    <img src="${article.urlToImage}" alt=${article.title}
                        style="max-width: 256px; border-radius: 5px; ${
                            i % 2 === 0 ? "margin-right: 15px" : "margin-left: 15px"
                        }" />
                    </div>
                    `;
            }
        })}

        </div>
    </div>

</body>

</html>
    `;

    return template;
};
