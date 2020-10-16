# Attributes / variables 
 - Photo
 - Gender: male/female divide for separating blocks; not required for participant
 - Town and bio
 - Number of peers watching
 - Score: 1 (worst), 2, 3, 4 (best), or not provided

# Setup

Configuration occurs in `src/assets`. Photos can be any standard photo format (e.g. jpg, png). 

The participant's photo can have any name and must be the sole photo in the `participant-image` directory. 

The photos for the raters/ratees with whom the participant interacts exist in the `impersonator-images` directory. These should not change between participants. They can be named in any way but their naming must correspond to the names (i.e. unique IDs) in `impersonators.json`. 

*Note: There cannot be fewer, more, or different names between the `json` file and the `impersonator-images` directory, because the photos are not matched directly to their data by name but rather by alphabetizing both sets of names. This means that slight differences between the sets can lead to mistaken matching of photos to their bios.*

# Trial ordering and configuration

`impersonators.json` contains data about all the raters/ratees with whom the participant interacts. It is of the shape:
```
{
    "blocks": {
        "watching": [ { "rater": "<name>", "ratee": "<name>", "score": <number> }, ... ],
        "rating": {
            "f": [ { "ratee": "<name>" }, ... ],
            "m": [ { "ratee": "<name>" }, ... ]
        },
        "rated": {
            "f": {
                "acceptance": [ { "rater": "<name>", "score": <number> }, ... ],
                "rejection": [ { "rater": "<name>", "score": <number> }, ... ]
            },
            "m": {
                "acceptance": [ { "rater": "<name>", "score": <number> }, ... ],
                "rejection": [ { "rater": "<name>", "score": <number> }, ... ]
            }
        }
    },
    "bios": { "<name>": { "gender": "f" | "m", "town": "<townname>", "bio": "<description>" }, ... }
}
```

The two main sections of this file are "blocks" and "bios". 

"blocks" contains the different types of blocks and their specific configurations, including raters and ratees in various blocks who are described in "bios". There should not exist any names in "blocks" which do not have a corresponding key-value pair in "bios". 

"bios" describes each person, providing the text caption for a photo. If the same people are in multiple trials, they should only have one entry in "bios".

TODO We need to identify whether the rough estimate of the number of people watching is specified in `impersonators.json` or whether it is randomized within the program and recorded. 

# Watching block

For the one "watching" block, there are 15 trials which each contain a rater, ratee, and score. Scores are randomized between 1 and 4 (no "rating not provided" trials). The trials within a block are not randomized. 

# Rating blocks

For the two "rating" blocks, there are 15 trials (total 30) which each contain a ratee who is of the block's specified gender. The participant is the rater and they determine the score, which is recorded within the program. The participant cannot give "rating not provided" as an answer. Between the two blocks (male and female), either can go first -- the blocks' order is randomized, although the trials within a block are not. 

# Rated blocks

For the four "rated" blocks, there are 15 trials (total 60) which each contain a rater who is of the block's specified gender and a score (1-4 or "rating not provided"). The participant is the ratee. Between the two gender categories (male and female), either can go first. Within the gender categories, either the acceptance-majority or rejection-majority can go first. The trials within a block are not randomized. 

# Random elements (same for all participants)
 - Raters / ratees for each block and their ordering within the block
 - The scores assigned in the "watching" block
 - The scores assigned in the "rated" blocks
    - For acceptance-majority blocks, of the 15 trials:
        - 10 are random choices between 3 & 4 (acceptance)
        - 3 are random choices between 1 & 2 (rejection)
        - 2 are 0, indicating the "rating not provided" option
    - For rejection-majority blocks, of the 15 trials:
        - 10 are random choices between 1 & 2 (rejection)
        - 3 are random choices between 3 & 4 (acceptance)
        - 2 are 0, indicating the "rating not provided" option
    - The ordering of scores is random within a block

# Random elements (randomized for each participant)
 - Ordering between male and female blocks of the "rating" or "rated" type
 - Ordering of acceptance- and rejection-majority blocks within male and female categories for "rated" blocks. Therefore, there are 8 possible configurations:
    - F acc, F rej, M acc, M rej
    - F acc, F rej, M rej, M acc
    - F rej, F acc, M acc, M rej
    - F rej, F acc, M rej, M acc
    - M acc, M rej, F acc, F rej
    - M acc, M rej, F rej, F acc
    - M rej, M acc, F acc, F rej
    - M rej, M acc, F rej, F acc