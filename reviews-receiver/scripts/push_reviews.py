import requests

API_KEY = "fe5d4e82668855fa9b5b30bbfe1e765b05cc00d707c9884481a58793db84d562"

reviews = [{
    "value": "The system seems interesting, but it's a bit too early to tell how effective it will be. I'm waiting to see more functionalities before I can really recommend it.",
    "date": "2024-02-02 01:01:01"
},
    {
        "value": "The setup process was confusing, and it took way longer than expected to integrate with my website. The insights dashboard feels cluttered, and I couldn't find the information I was looking for easily.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "This platform is a game-changer! Having all my customer reviews in one place with clear insights is fantastic. The sentiment analysis helped me identify areas to improve, and the action items are super helpful. Highly recommend!",
        "date": "2024-02-02 01:01:01"
    }, {
        "value": "This platform is a great starting point for understanding customer feedback. The visualizations are clear, and I like that I can drill down into specific topics.  I would love to see more advanced features like competitor analysis in the future.",
        "date": "2024-02-02 01:01:01"
    }]

url = "http://localhost:3000/batch"

requests.post(url, json={"reviews": reviews}, headers={"x-api-key": API_KEY})
