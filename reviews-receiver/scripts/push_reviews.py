import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
URL = os.getenv("URL")

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
    },
    {
        "value": "This platform is bad, I did not like it. The analysis was not accurate, and the interface was clunky. I would not recommend this to others.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "This platform is not very useful. The insights are not actionable, and the analysis is not accurate. I would not recommend this to others.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "This platform is not well designed. The colors are too bright, and the interface is clunky. I would not recommend this to others.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "This platform is not worth the price. The features are limited, and the analysis is not accurate. I would not recommend this to others.",
        "date": "2024-02-02 01:01:01"
    },
    {
        "value": "This platform is fine. I do not know what to say.",
        "date": "2024-02-02 01:01:01"
    },

]

response = requests.post(URL, json={"reviews": reviews}, headers={"x-api-key": API_KEY})

# Printing the response information
print("Response Status Code:", response.status_code)
print("Response Headers:", response.headers)
print("Response Text:", response.text)
