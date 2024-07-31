Abstract

In the history of information that has been forgotten, recipe recommendation systems play a major role in providing individuals with meal planning and cuisine exploration. 
This report presents the development of a content-based recipe recommendation system using NLP techniques. The author's research leverages a diverse recipe dataset, provides text preprocessing, 
and utilizes TF-IDF-based feature extraction to create recipe and user profiles. The report dives more deeply into data preprocessing, model development, and evaluation using precision, recall, and F1 score metrics. 
Additionally, the author discusses the incorporation of flavors and expertise for people who are struggling to find good and easy recipes to make. The author addresses challenges and limitations and proposes directions for future enhancement. 
This project contributes to the advancement of recipe recommendations, empowering users to explore and enjoy a wide range of cuisine experiences.

Keywords

Recommendation system, Content-Based Recommendation, Natural Language Processing, TF-IDF, Cosine Similarity, User Profile, Item Profile, Data Cleaning, Web Scraping, User Preferences.


Subject Descriptors
•	Information systems → Information retrieval → Retrieval tasks and goals → Recommender systems
•	Information systems → Information systems applications → Data mining → Data cleaning
•	Applied computing → Life and medical sciences → Consumer health 
•	Computing methodologies → Machine learning → Learning paradigms → Supervised learning → Supervised learning by regression


![image](https://github.com/user-attachments/assets/52a8a13c-ef4a-4b84-83c0-e26140fd4668)

Selection of Requirement Elicitation Methodologies

In the process of requirement gathering, various methods and techniques are crucial to ensure a comprehensive and accurate understanding of the project's needs. The author of the study utilized a multi approach, 
incorporating methods such as literature review, surveys, and prototyping. The literature review involved an in depth examination of existing academic and industry depended, challenges, and trends within the domain of interest. 
Surveys were conducted to gather direct feedback and opinions from stakeholders, providing a valuable perspective on their expectations and requirements. 
The use of prototyping allowed for the creation of visual representations of the solutions, and a more interactive exploration of user needs and preferences. 
By showing set of elicitation methods, the author ensured a proper understanding of the requirements and real world perspectives. 
This multi approach enhances the reliability of the gathered requirements, contributing to the development of more effective and user friendly solutions.
![image](https://github.com/user-attachments/assets/78cced14-65e8-4183-8ba5-ec715025a00e)



![image](https://github.com/user-attachments/assets/11a73236-b811-40f5-9659-bca8ac9612cd)


Discussion of tiers/ layers of the Architecture

Data Tier
1.	Preprocessed Ingredients And Titles:
•	This data tier contains preprocessed information related to recipe ingredients and titles. The preprocessing step extracts relevant features that can be used by recommendation models.
2.	Anonymous past user bias preference Data:
•	This data is collected based on users’ past interactions, ratings, or scores during their previous sessions. It helps in recommendations according to individual user preferences.

Logic Tier
1.	Recommendation Models:
•	Content-Based Recommender: Utilizes the features of recipes, such as ingredients and titles, to suggest similar recipes based on content.
•	Content-Based Popularity-Based Recommender: Recommends popular recipes based on user engagement and popularity trends.
•	Content-Based Ingredient-Based Recommender: Focuses on recommending recipes based on specific ingredients, catering to users with ingredient preferences.
2.	Backend Proxy:
•	Acts as an interface exposing backend services to the front end. It facilitates communication between the presentation tier and the logic tier, handling requests and responses.
3.	API:
•	API that enables integration between different modules within the logic tier, ensuring data flow and functionality.
4.	User Recommendations Monitor:
•	Monitors user recommendations update user preferences and refine the recommendation process.
5.	Recommendations Evaluator and Classifier:
•	Evaluates the quality of recommendations produced by different models. Classifies models and contributes to continuous improvement.
6.	Data Preprocessor:
•	Recipe Data Preprocessor: Handles the preprocessing of raw recipe data, making it suitable for recommendation models.
•	NLP Data Parser: Responsible for natural language processing, extracting valuable information from textual data, and enhancing the understanding of recipe content.(spaCy, tokenizer, lemmatization)
7.	Data Storage
The recipe dataset will be stored in a NoSQL Database to ensure more flexibility in tuning the data

Presentation Tier (Client Tier)
1.	User Login System:
•	Facilitates user authorization, ensuring secure access to recommendations and features.
2.	Recommendations Feed UI:
•	User interface displaying a feed of recipe recommendations. Provides an engaging and user-friendly platform for users to explore recommended recipes.
3.	Search Recipes:
•	Enables users to search for specific recipes, enhancing user control and facilitating a more targeted recipe discovery experience.
4.	Recommendation on Selective Ingredients:
•	Allows users to receive recommendations based on specific ingredients of interest, catering to individual tastes and preferences.
5.	User Profile Log Out:
•	Manages user profiles and log-out, and secure user experience.

