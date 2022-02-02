# To-Do
* General
    - [ ] Include an automatic scroll end idea load instead of button?
    - [ ] Find way to query random doc in Firestore to enable random idea component again
    - [ ] A type o ElastiSearch that queries entire cllection as Search progresses.
        - [x] Figure out how to avoid seeing login page on consecutive loads
* Home page
	- [ ] Show new idea added locally
        - [x] Show random idea on top of older ideas with quick up/downvotes
        - [x] Fix data flow to avoid refetching full collection's data on up/downvoting
        - [x] Have footer stay at botom of page even while searching
        - [x] Fix logout popup to user's image for responsive
        - [x] Center brainFart text
        - [x] Added delete confirmation component
        - [x] Add site logo
        - [x] Style the logout button
        - [x] Add functional search bar
        - [x] Figure out prop drill flow to show profile picture for Google/Anon
        - [x] Add logout button
* Login Component
        - [x] Style and add privacy policy
        - [x] Add twitter authentication
        - [x] Add anon button 
        - [x] If auth skipped don't allow adding ideas only reading
* Search
        - [x] Add customizable filter to sort ideas
* AddIdea
        - [x] Have textarea height increase automatically
        - [x] Have inputtext element height increase for long texts
        - [x] Check why user context here shows null even though it prints in other scripts
        - [x] Add conditional render if user.isAnon is true
* Idea card
        - [x] Fix error where one can upvote infinitely by upvoting then downvoting and undownvoting
        - [x] Save upvote or downvote to show as changed button color from load
        - [x] Add functionality to up/down vote buttons considering 1 user can only submit 1 up/down vote for an idea to avoid spamming.
        - [x] Figure out how to update upvote on only 1 idea and not pull full database to avoid re-render of whole list
        - [x] Trigger re-render of all ideas after deleting some idea
        - [x] Show delete button to user only for their own ideas
        - [x] Add upvote and downvote button
        - [x] Add user and time of idea
        - [x] Add delete button
* Other
    - [ ] Add XML sitemap for SEO
    - [ ] Consider adding Next.js for SSR
    - [ ] Check what robots.txt
        - [x] Check out React routers?
        - [x] Check how to add checkmarks in README