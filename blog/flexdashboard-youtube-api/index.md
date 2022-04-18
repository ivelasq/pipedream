---
title: "Building a flexdashboard that displays YouTube API data"
categories: ["tutorial"]
date: '2022-04-18'
description: "Got a bunch of YouTube video data to display on a dashboard? Here's how to create one with flexdashboard and tuber."
image: "thumbnail.jpg"
image-alt: "Utagawa Yoshikazu, Early Foreign Photographer in Yokohama"
---

![Utagawa Yoshikazu, Early Foreign Photographer in Yokohama](thumbnail-wide.jpg){fig-alt="A group of people around a camera in a bright, colorful room"}

[R-Ladies](https://rladies.org/) hosts an amazing number of Meetups. It is so inspiring and exciting to learn from R users from around the globe. However, due to work, time zones, or other commitments, I am unable to attend all of the events. Thankfully, since the pandemic began, recording webinars have become more prevalent. This provides a great opportunity to catch up on things I've missed afterward.

R-Ladies also have a variety of YouTube channels. The [R-Ladies Global](https://www.youtube.com/channel/UCDgj5-mFohWZ5irWSFMFcng) channel has the most videos, but local chapters often have their own account. I wanted an easy way to see all the videos from all the chapters I could find at once. I also wanted to search by presenter, topic, etc.

So, I set out to build a [flexdashboard](https://pkgs.rstudio.com/flexdashboard/) that would display all this information for me. Since flexdashboard is built on R Markdown, I could use custom colors and styles. Finally, I linked it to an [RStudio Connect](https://www.rstudio.com/products/connect/) account so that it could refresh daily.

This post will walk through how I created a flexdashboard that pulls in YouTube API data. The code for the dashboard is on [GitHub](https://github.com/ivelasq/rladies-video-feed) in case you want to reuse it with another set of channels!

:::{.callout-warning}
## YouTube RSS vs. YouTube API
I originally used the [tidyRSS]() package to pull the videos from YouTube. However, the YouTube RSS feed limits results to the latest 15 videos. The code is still available in the repo if you would like to take a look. This is a good option if you only want the most recent stream of content and do not want to set up Google credentials.
:::

## Get Google credentials

As is often the case with anything to do with Google, first you must get credentials.

1. Create a [new project](https://console.cloud.google.com/projectcreate)
2. Go to [APIs & Services](https://console.cloud.google.com/apis/credentials
) and click "Credentials"
3. At the top, click "Create Credentials" and choose "OAuth client ID"
  - If it's your first time, you have to configure consent
  - I had to choose "External" on the consent screen
  - Give your app a name, an email, and a developer contact email
  - Go back to Credentials, click "Create Credentials" and choose "OAuth client ID"
4. Choose Web application and give your ID a descriptive name
  - I also had to add a redirect URI so that I could preview the app on my computer (what you see when you render the flexdashboard), it looks like `https://localhost:4321/`. If you get a `400` error when you try to authenticate tuber later, you may have to do the same.
5. Your Client ID and Client Secret will pop up. I saved these in my R environment so I didn't have to include them in my code. ^[You can do this by running `usethis::edit_r_environ` and adding two rows with `YOUTUBE_CLIENT_ID=num1` and `YOUTUBE_CLIENT_SECRET=num2`, then restarting your R session.]

## Pull and clean data

Woohoo, you are credentialed! It's time for the fun part --- pulling and cleaning data. I did this in a script called `data_processing.R`.

I used the [tuber](https://soodoku.github.io/tuber//index.html) package to access the YouTube API with R. Here are other packages that will aid you in your cleaning process:

``` R
library(tuber)
library(readr)
library(dplyr)
library(stringr)
library(DT)
```

Create a spreadsheet with the channels you are interested in. I did not create this programmatically, just searched on YouTube to find all the R-Ladies channels I could. I tried to do as many things as programmatically as possible, so I only included the name of the chapter, its thumbnail, and the channel ID.

``` R
dat <-
  read_csv("https://github.com/ivelasq/rladies-video-feed/blob/main/r-ladies_channels.csv")

head(dat)
```

:::{.callout-warning}
## YouTube Channel IDs
Some YouTube channels have 'custom IDs' like RLadiesGlobal. These won't work, you need the original IDs to put into tuber. The best way I found to get this ID is to click on a video from a channel. Then, scroll down to the description and click the channel name from that video. Then it will appear in the URL after `/channel/`. A good idea for a future Shiny app would be a way to pull this information from the YouTube API...
:::

Now, create a few more columns with `dplyr::mutate()` that expand the URLs in HTML format:

``` R
dat_urls <-
  dat %>%
  dplyr::mutate(
    feed = paste0("https://www.youtube.com/feeds/videos.xml?channel_id=", id),
    feed_url = paste0("yt:channel:", id),
    channel_image_url = paste0(
      "<img src='",
      image,
      "' alt='Hex Sticker for Chapter' width='40'></img>",
      " <a href='https://www.youtube.com/channel/",
      id,
      "' target='_blank'>",
      chapter,
      "</a><br>"
    ),
  )
```

Pull in the credential info that had you going through all those hoops earlier.

``` R
yt_oauth(
  app_id = Sys.getenv("YOUTUBE_CLIENT"),
  app_secret = Sys.getenv("YOUTUBE_CLIENT_SECRET")
)
```
You may see the message below and have to type in a `1` to open an authentication window (be sure to read and follow the instructions in the console). 

``` bash
Use a local file ('.httr-oauth'), to cache OAuth access credentials between R sessions?

1: Yes
2: No
```

Great, now you have access to YouTube data! Let's use the tuber package (finally).

The [documentation](https://soodoku.github.io/tuber/reference/index.html
) describes the many functions available to you. Since I started with channel IDs, I wanted to use `list_channel_videos()` to get the list of videos from the channels. Notice that there's a default limit for the number of videos pulled from the API. I bumped that up a bit.

For example, for the R-Ladies Global channel, you could run:

``` R
list_channel_videos("UCDgj5-mFohWZ5irWSFMFcng", max_results = 200)
```

What if you want the results for all the channels you have in our spreadsheet? I used a loop for this. This loop says: Starting with an empty data frame called `dat_videos` , for each row in `dat_urls` (which contains the channel IDs), find the channel ID, pull it out, run it through `list_channel_videos`, and then add the information as a row to `dat_videos`.

The arguments in `list_channel_videos` give me all the columns I am interested in with `part = "snippet"` and up to 200 results from the channel.

``` R
dat_videos <- NULL

for (i in 1:nrow(dat_urls)) {
  tmp <-
    dat_urls[i, ]["id"] %>%
    pull() %>%
    list_channel_videos(.,
                        part = "snippet",
                        config = list('maxResults' = 200))
  
  dat_videos <- bind_rows(dat_videos, tmp)
}
```

Then, I brought back the URL info:

``` R
dat_join <-
  dat_videos %>%
  left_join(., dat_urls, by = c("snippet.channelId" = "id"))
```

This results in a **lot** of information for each video. I cleaned it up a little bit so that the data frame only contained the columns I was interested in and were in HTML format.

``` R
dat_dashboard_dat <-
  dat_join %>%
  mutate(
    video_url = paste0(
      "<a href='https://www.youtube.com/watch?v=",
      snippet.resourceId.videoId,
      "' target='_blank'>",
      snippet.title,
      "</a>"
    ),
    channel_url = paste0(
      "<img src='",
      image,
      "' alt='Hex Sticker for Chapter' width='40'></img>",
      "<a href='https://www.youtube.com/channel/",
      id,
      "' target='_blank'>",
      chapter,
      "</a>"
    ),
    date = as.Date(str_sub(snippet.publishedAt, 1, 10))
  ) %>%
  arrange(desc(snippet.publishedAt)) %>%
  select(date, chapter, channel_url, video_url, channel_image_url)
```

## Create a flexdashboard

You have the YouTube data --- time to create a pretty dashboard!

My flexdashboard starts as it often does: with a YAML header. I specified an orientation (columns) and added the link to the GitHub repository in the navigation bar.

``` YAML
---
title: "R-Ladies YouTube Video Feed"
output: 
  flexdashboard::flex_dashboard:
    orientation: columns
    navbar:
      - { icon: "fa-github", href: "https://github.com/ivelasq/rladies-video-feed", align: right }
---
```

### Add customization

If you'd like your dashboard to have a custom look, the [bslib](https://rstudio.github.io/bslib/) package is a great option. Ir can add different colors and fonts all from the YAML header. Make sure to add `library(bslib)` in the actual code part of your `.Rmd` file. I used the R-Ladies style guide to fill out the rest of the YAML header:

``` YAML
---
title: "R-Ladies YouTube Video Feed"
output: 
  flexdashboard::flex_dashboard:
    orientation: columns
    navbar:
      - { icon: "fa-github", href: "https://github.com/ivelasq/rladies-video-feed", align: right }
    theme:
      bg: "#FDF7F7"
      fg: "#88398A" # purple
      primary: "#88398A" # purple
      base_font:
        google: "Lato"
      code_font:
        google: "Inconsolata"
---
```

### Add packages for the dashboard

After the YAML header, add the packages you need. I used `source()` to read in the R script that pulls in, cleans, and saves the data for the dashboard.

``` R
library(flexdashboard)
library(bslib)
source("data-processing.R", local = knitr::knit_global())
```

## Fill out the dashboard

I recommend checking out the flexdashboard documentation to create the look you would like. This dashboard was simple: just a sidebar and the main section.

This code builds out the sidebar section. I created a list of each chapter that I was able to find and arranged them by name. With `shiny::HTML()`, the dashboard can render the URLs as HTML (the reason for all that manipulation earlier on).

````
Sidebar {.sidebar}
-----------------------------------------------------------------------

The purpose of this dashboard is to provide a running feed of R-Ladies videos posted to YouTube. It is refreshed every six hours.

Currently, the feed includes these channels:

```{r}
dat_join %>% 
  arrange(chapter) %>% 
  distinct(channel_image_url) %>% 
  pull() %>% 
  shiny::HTML()
```
````

For the main body, I used the [DT](https://rstudio.github.io/DT/) package to create a table for the information in our clean dataset. I added a bit of HTML to make it expand to the entire column height.

A couple of fun tricks to notice:

* `escape = FALSE` renders the URLs within the table as HTML
* The list within `options` aligns the text within columns (in this case, to be in the middle of the cell for all columns)^[I found out about this here: https://stackoverflow.com/questions/35749389/column-alignment-in-dt-datatable.]

There are a lot of customization options!

````
Column {data-width=900}
-----------------------------------------------------------------------

### By default, the list is sorted by latest video.

<style>
.dataTables_scrollBody {
    max-height: 100% !important;
}
</style>

```{r}
dat_dashboard_dat %>%
  select(-chapter,-channel_image_url) %>%
  datatable(
    colnames = c('Date', 'Channel', 'Video'),
    filter = 'top',
    escape = FALSE,
    height = '1000',
    options = list(columnDefs = list(
      list(className = 'dt-middle', targets = "_all")
    ))
  )
```
````

And that's it! Knit the flexdashboard to see the final dashboard.

![Final dashboard](dashboard.png){fig-alt="Screenshot of the final dashboard with a sidebar of the R-Ladies channels and the main section showing the table of videos from the various chapters"}

Try it out --- search "Shiny" to see any video with Shiny in the title!


