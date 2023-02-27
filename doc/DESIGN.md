# Colec - UX design notes

## Motivation

The need to track collections is universal. People want to track music they own to make it easier to manage their collection, keep a wishlist, or organize albums they want to sell. Others want to track all music they listened to, because they find themselves forgetting what they already checked out in the past. The same need arises for fans of videogames, movies, TV shows, or any number of more specialized or esoteric hobbies.

Countless applications and online services have popped up to answer this need, and many of them are enjoying high popularity and have thriving communities. However, they tend to be very rigid in their ways. Users who are not interested in rating the items they're collecting find themselves unable to disable the rating field, while users who want to describe the state of their physical items in great detail have to make do with a generic "Notes" field. Furthermore, people who want to track more than one kind of collection have to juggle multiple accounts on different websites, all with wildly different feature sets and UIs. This causes user frustration, which can be addressed by a generic, centralized and highly customizable service.

## Market research

Some of the more popular trackers are:

-   [Rate Your Music](https://rateyourmusic.com): music collection tracker,
-   [Backloggery](https://backloggery.com): videogame collection and progress tracker,
-   [last.fm](https://www.last.fm): automated music listening tracker,
-   [Discogs](https://www.discogs.com): music catalogue with library tracking functionality and physical item marketplace,
-   [Trakt](https://trakt.tv): TV show and movie watching tracker. 

These services all make use of their limited scope by adding specialized features. Music trackers allow browsing by artist, rating websites aggregate ratings of all users of the service, TV show trackers send notifications about newly aired episodes. They usually keep a public catalogue of their content, making it easier to add an item that other people already added without inputting all the details. They also often provide social features, such as adding friends, sending recommendations, posting public reviews, and sending private messages to others.

## Public probe

The idea of this project came out of a personal need, so conveniently I am able to design it with myself in mind as the target audience. I am a user of many of the websites listed in [market research](#market-research), and would like to consolidate them into a single customizable interface so that my overall experience is smoother and more personal.

I also have contact with a few other people who track one or more of their collections. I expect to be able to interview them to make a better and more attractive product.

Below is an aggregation of collected opinions:

-   Adding items for the first time is a time-consuming process. Ideally I'd be able to browse existing information sources, and import from websites I'm already using.
-   I really enjoy using the feature where I can add others to my friends list and send them recommendations.
-   I want to create custom tags that I can assign to items, to track any details I want about the items. Then I'd like to filter my items by collection and tag.

## Scope

Having confirmed that the idea has potential users and what they're most interested in seeing, we can determine which features will go into the MVP, and which are optional to some degree.

Critical:

-   Single-page app design for the best possible responsiveness and user experience,
-   Multiple users per deployment, with registration and login,
-   Support for multiple arbitrary collections per user,
-   Collection editor to add/remove/modify/reorder fields, with many fields types available,
-   Item editor to add/modify/remove items from previously created collections,
-   Collection viewer with sorting and filtering functionality,
-   Frontpage explaining the purpose of the webapp,
-   Dashboard for logged-in users, showing featured items and allowing them to navigate to their collections easily,
-   Responsive and compliant design.

High:

-   Collection templates for getting started more easily,
-   Friend list functionality, allowing users to add other users as friends knowing their username, and displaying their latest activity on the dashboard,
-   Feature to send recommendations to users on the friend list, and manage received recommendations by deleting them or making them as fulfilled.

Medium:

-   Per-item image upload,
-   Item suggestions from content catalogues like MusicBrainz or Mobygames,
-   Import of items from other trackers, if they have an export feature,
-   Data export feature into a format like JSON.

Low:

-   Ability for users to publicly comment on others' profiles,
-   Private messages between users.

## Information flow

This project involves a non-trivial number of models and screens. The flowchart below outlines the flow between screens.

[Flowchart of information flow between components](information-flow.png)
