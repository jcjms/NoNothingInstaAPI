# No Nothing Insta API
I came across this while working on a project involving Instagram Web Scraping. The issue I encountered was that when you access an Instagram profile using its URL (e.g. https://instagram.com/username), you are greeted with a message stating "This page isn't available" (translated from German). This meant that obtaining user data without logging in was quite challenging (scraping from my own account got it temporarily disabled). Therefore, I needed a workaround.

I saw that when I opened the desired account page, the username briefly appeared in the tab title. To me this meant that the data was 100% accessible, at least for a moment. Opening the console and searching for keywords from my personal account, I stumbled upon a JSON object containing all the necessary user data for my project, without requiring any login or additional steps. Wich lead me to writing this script.

Although the script doesn't provide as much data as I initially hoped for, it still offers a useful amount that was sufficient for my project. Importantly, it accomplishes this without scraping various elements or requiring login credentials. I hope that anyone who comes across this discovery can find a suitable use case for their needs. If you discover something else, please consider contributing :)

Here are the most important things it can retrieve:

- **Author Name (Accountname)**
- **Author Alternate Name (Username)**
- **Author Type (e.g. Person)**
- **Author URL (Profile URL)**
- **Author Image (Profile Picture URL)**
- **Description (Biography)**
- **Interaction Statistic User Interaction Count 1 (https://schema.org/FilmAction)**
- **Interaction Statistic User Interaction Count 2 (http://schema.org/FollowAction)**

`+` these custom ones I've added:

- **Link (if included in Biography)**
- **Email (if included in Biography)**