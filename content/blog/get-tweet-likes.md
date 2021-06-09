---
tags: ["scrape", "tidy", "twitter-data"]
date: "2020-11-10"
title: "Browse and Search Liked Tweets Using R"
---

How to download your liked Tweets using R.

<!--more-->

The other day, I was scrolling through my "liked" Tweets and got maybe 100 deep when I accidentally clicked a hyperlink and had to restart scrolling from the beginning. The experience made me so frustrated that I started looking up easier ways of perusing one's likes. I found [this tutorial](https://medium.com/@xoelop/how-to-browse-and-search-your-liked-tweets-711fc1b70851) that walked through how to pull liked Tweets into a CSV using Python - so I decided to give it a shot using R.

## Set Up Your Project

For this tutorial, I set up a project with the following structure. I walk through how to create `like.js` and `like_csv.csv` in the walkthrough.

```
+-- code.R
+-- data
|   +-- like.js
+-- output
|   +-- likes_csv.csv
```

## Getting Liked Tweets

### Step 1: Download Your Twitter Archive

Like the Python tutorial, you have to first download your Twitter archive. 
Go to https://twitter.com/settings/your_twitter_data, enter your password, and "Download Archive". You will get an email when you can download your data - for me, it took a day.

Once downloaded, open the ZIP file. Save the `like.js` file in your project's `data` folder.

### Step 2: Load the JS File and Convert to Data Frame

Now, start an `R` script (I called mine `code.R`). First install (if you haven't already) and load all the libraries.


```r
library(tidyverse)
library(rjson)
library(rtweet)
```

The `like.js` file is a Javascript file. To convert it to a data frame, first convert to a JSON file by removing the text that makes it Javascript, read in the JSON, and then flatten into a data frame using `purrr::flatten_df`.


```r
js <- read_file(here::here("data", "like.js"))
json <- sub("window.YTD.like.part0 = ", "", js)
 
likes_raw <-
  fromJSON(json)

likes_df <-
  likes_raw %>% 
  flatten_df()
```

Now your likes, their status IDs, and URLs are stored in `likes_df`.

### Step 3: Authenticate {rtweet} and Get Tweet Info

To get the Tweet info, you have to authenticate your Twitter account and get the API keys. Go to your [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps) to do this. The {rtweet} vignette [here](https://cran.r-project.org/web/packages/rtweet/vignettes/auth.html) covers what to do pretty well, but one thing I noticed is now you have to enable "3-legged OAuth" and there, you can add the Callback URL of `http://127.0.0.1:1410` (otherwise you will get a 401 error when running the code below).


```r
token <-
  create_token(
    consumer_key = "PUT API KEY IN QUOTES HERE",
    consumer_secret = "PUT API KEY SECRET IN QUOTES HERE"
  )
```

Once your `token` is saved, you can use `rtweet::lookup_statuses` to get the Tweet info.


```r
likes_dat <-
  lookup_statuses(likes_df$tweetId)
```

There you have it! All your likes and their information saved in the `likes_dat` data frame. Here, you can do all of your usual data manipulation - `lookup_statuses()` results in a LOT of data, so I recommend narrowing down to the columns you care about using `select()`.

### Step 4: Save to a CSV

Saving to a CSV is a bit tricky because `lookup_statuses()` creates list-columns, which cannot be exported to a CSV.

Here, I've selected only the columns `status_id`, `text`, and `hashtags` to look at. `hashtags` is a list-column because one Tweet may have multiple hashtags, which is then saved as a vector within the column `hashtags`. To convert it to a data frame, I use `unnest()`. This creates a data frame with multiple entries for each Tweet, one for each hashtag.

That is too long for me since I want to quickly look through my likes. I then create a hashtag ID for each tweet by grouping by the `status_id` and assigning each of its hashtags an ID using `row_number()` and then using `pivot_wider()` to move each hashtag into its own column.

You will see that some tweets have blank entries while some tweets have many!


```r
likes_csv <-
  likes_dat %>% 
  select(status_id, text, hashtags) %>% 
  unnest() %>% 
  group_by(status_id) %>% 
  mutate(id = row_number()) %>% 
  pivot_wider(names_prefix = "hashtag_",
              names_from = id,
              values_from = hashtags)
```

Now, this is savable in a CSV. You can run the code below if your project has an `output` folder.


```r
write_csv(likes_csv, here::here("output", "likes_csv.csv"))
```

Thank you for reading this quick entry in looking through your Twitter likes. I hope this reduces the amount of annoying scrolling you need to do to look through your Tweets! I think there's a lot of possibility to make this an even easier process - maybe a Shiny app? - but hopefully this is a good starting off point.
