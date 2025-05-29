# TO DO


# Flashcards Creation
- Set Manager Page                  
    - [ ] - Locally save flashcard creation progress
    - [ ] - Auto card creation from given data eg: (front, back, category)
    
    - Manage Cards Section
        - [x] - When you click edit on a card in the manage section it should open up the cards info on the form and the add card button changes to save card
        - [x] - Clicking delete will delete card from database, pop up verify user choice -> option to not show again
        - [ ] - When using manual creation mode implement auto complete for answers
    - Create Card Section
        - [x] - When making a new card after submission clear form
        - [x] - After selecting a set in the drop down, sets data should be displayed
        - [x] - Creating a new set causes selected set == new set
        - [ ] - Upload set to database with corresponding user (change userid to clerk current user)
        - [x] - Card Count needs to update on new card and when you retrieve a card
        - [ ] - Allow images to be input as questions or answers. (Set up an s3 bucket and handle image processing)
        - [ ] - Allow the option to edit the image: should contain basic image editing functions
        - [ ] - Auto recommend images for back side
    
- My Sets Page
    - [ ] - Display all user sets with option to view, edit, or delete

- View[id] Page     
    - [ ] - Display all cards in selected set with option to delete and manage. On click of a card, play the set starting on clicked card
    
- Play[id] Page
    - [ ] - Randomly shuffle cards and display each card.
    - [ ] - Functions: reshuffle, know, don't know, close
    - [ ] - End of set show statistics and ask to retry with unknown cards or reset fully
    - [ ] - Start cards with back
    - [ ] - Shuffle what face of card will be viewed first

- Practice[id] Page
    
- Search Page
    - [ ] - Show all sets in certain categories like geography, languages, math, etc..
    - [ ] - Ability to review a user created flashcard set from 1 to 5 stars, allow users to have a user review rating and verified accounts