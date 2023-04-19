const createTemplateHtml = () => {
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
            position: relative;
            padding: 20px;
            background-color: #f0f0f0;
        }

        .header .image-container {
            position: relative;
        }

        .header .image-wrapper {
            width: 100%;
            top: 0;
            left: 0;
            position: absolute;
            height: 200px;
            background-color: #333;
            opacity: 0.5;
        }



        .header img {
            /* margin: 0 auto; */
            width: 100%;
            /* visibility: hidden; */

            /* object-fit: cover; */
            max-width: 100%;
            height: 200px;
        }

        .header h1 {
            color: white;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            margin-top: 10px;
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
            list-style-type: none;
            padding: 0;
        }

        .article-list li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .article-list img {
            max-width: 80px;
            height: auto;
            margin-right: 10px;
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

                <img src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-EiznRVplky8ROzn33fqgtHDM/user-HkhXZ2W6gyLpCo1Ccc7fkOFl/img-S7T6y8NcYXvkLCtQgGvwybzf.png?st=2023-04-19T08%3A20%3A10Z&se=2023-04-19T10%3A20%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-19T08%3A46%3A21Z&ske=2023-04-20T08%3A46%3A21Z&sks=b&skv=2021-08-06&sig=WTsrSq/MFyS7AIVMq1vv/kCCGgdJbBRoG6frijyI0uM%3D"
                    alt="Newsletter Header">
            </div>
            <h1>Newsletter Title</h1>
        </div>

        <!-- Short Content Section -->
        <div class="short-content">
            <p>This is a summary of some of the articles featured in this newsletter.</p>
        </div>

        <!-- Article List Section -->
        <div class="article-list">
            <h2>Featured Articles</h2>
            <ul>
                <li>
                    <img src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-EiznRVplky8ROzn33fqgtHDM/user-HkhXZ2W6gyLpCo1Ccc7fkOFl/img-S7T6y8NcYXvkLCtQgGvwybzf.png?st=2023-04-19T08%3A20%3A10Z&se=2023-04-19T10%3A20%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-19T08%3A46%3A21Z&ske=2023-04-20T08%3A46%3A21Z&sks=b&skv=2021-08-06&sig=WTsrSq/MFyS7AIVMq1vv/kCCGgdJbBRoG6frijyI0uM%3D"
                        alt="Article 1 Thumbnail">
                    <div>
                        <h3><a href="article1.html">Article 1 Title</a></h3>
                        <p>This is a brief description of the content of Article 1.</p>
                    </div>
                </li>
                <li>
                    <img src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-EiznRVplky8ROzn33fqgtHDM/user-HkhXZ2W6gyLpCo1Ccc7fkOFl/img-S7T6y8NcYXvkLCtQgGvwybzf.png?st=2023-04-19T08%3A20%3A10Z&se=2023-04-19T10%3A20%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-19T08%3A46%3A21Z&ske=2023-04-20T08%3A46%3A21Z&sks=b&skv=2021-08-06&sig=WTsrSq/MFyS7AIVMq1vv/kCCGgdJbBRoG6frijyI0uM%3D"
                        alt="Article 2 Thumbnail">
                    <div>
                        <h3><a href="article2.html">Article 2 Title</a></h3>
                        <p>This is a brief description of the content of Article 2.</p>
                    </div>
                </li>
                <li>
                    <img src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-EiznRVplky8ROzn33fqgtHDM/user-HkhXZ2W6gyLpCo1Ccc7fkOFl/img-S7T6y8NcYXvkLCtQgGvwybzf.png?st=2023-04-19T08%3A20%3A10Z&se=2023-04-19T10%3A20%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-19T08%3A46%3A21Z&ske=2023-04-20T08%3A46%3A21Z&sks=b&skv=2021-08-06&sig=WTsrSq/MFyS7AIVMq1vv/kCCGgdJbBRoG6frijyI0uM%3D"
                        alt="Article 3 Thumbnail">
                    <div>
                        <h3><a href="article3.html">Article 3 Title</a></h3>
                        <p>This is a brief description of the content of Article 3.</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</body>

</html>`;
    return template;
};

module.exports = { createTemplateHtml };
