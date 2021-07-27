---
title: "Politely Scraping Wikipedia Tables"
date: 2021-07-27
publishdate: 2021-07-37
tags: ["scrape"]
---

Walkthrough on "politely" scraping Wikipedia tables and transforming them into a tidy dataset.

<!--more-->

[Wikipedia](https://en.wikipedia.org/wiki/Main_Page) is such an amazing website, and also a fantastic source of data for analysis projects. I often find myself [scraping](https://en.wikipedia.org/wiki/Web_scraping) Wikipedia's tables for information and then cleaning and using the data for whatever I am working on.

However, scraping a website can create issues if not done properly. Though not required, I like to use the [{polite} package](https://github.com/dmi3kno/polite) to introduce myself to the website and ask for permission to scrape.

Recently, I submitted a [dataset] from Wikipedia to [TidyTuesday](https://github.com/rfordatascience/tidytuesday) and I wanted to share how I "politely" scraped the [Wikipedia table on independence days around the world](https://en.wikipedia.org/wiki/List_of_national_independence_days#List), cleaned it up, and submitted it for use - resulting in many beautiful and creative visualizations!

# Load libraries

There are several libraries needed for this walkthrough:


```r
# To clean data
library(tidyverse)
library(lubridate)
library(janitor)

# To scrape data
library(rvest)
library(httr)
library(polite)
```

# Scrape table

First, we save the web page with the table that we would like as `url`:


```r
url <- "https://en.wikipedia.org/wiki/List_of_national_independence_days"
```

Next, we use `polite::bow()` to introduce ourselves to the host, Wikipedia. This reads the rules from `robots.txt` and makes sure we follow them. The object (`url_bow` in this case) is saved as an object of class `polite`.


```r
url_bow <- polite::bow(url)
url_bow
```

```
## <polite session> https://en.wikipedia.org/wiki/List_of_national_independence_days
##     User-agent: polite R package - https://github.com/dmi3kno/polite
##     robots.txt: 456 rules are defined for 33 bots
##    Crawl delay: 5 sec
##   The path is scrapable for this user-agent
```

Next, we actually 'scrape' (pull the content of) the web page using `polite::scrape()`. This needs an object of class `polite` (created with `bow()` from before).

Since we politely scraped the entire web page, we want to use the {rvest} to specify what exact content we'd like to pull out. We can do this using `html_nodes()`.

How do we know which node we want? There are probably other ways of doing this. As a Firefox and Mac user, I click Cmd + Shift + C which opens up the Developer Tools so that I can select a specific element from the web page. I hover over the table to determine what the HTML is called, in this case, `table.wikitable`.

<center>
![](https://ivelasq.rbind.io/images/webpage.png)
</center>

This object is saved as an HTML table which is great, but a data frame would be preferable for analysis. So the final step is to use `rvest::html_table()` to read this table as something with which we can use tidyverse tools. The parameter `fill = TRUE` allows you to fill empty rows with `NA`.


```r
ind_html <-
  polite::scrape(url_bow) %>%  # scrape web page
  rvest::html_nodes("table.wikitable") %>% # pull out specific table
  rvest::html_table(fill = TRUE) 
```

# Flatten table

You will notice that `ind_html` is saved as a data frame within lists. If we want to convert it to a flat data frame, we can specify that we want the content from only the first element `[[1]]`. We con then use `janitor::clean_names()` for nice, standardized column names.


```r
ind_tab <- 
  ind_html[[1]] %>% 
  clean_names()
```

That's it! Now we've "politely" scraped the Wikipedia table into an analysis-ready data frame.

# Conclusion

Additional steps to clean the file can be found in my [GitHub repo](https://github.com/ivelasq/data-visualization-portfolio/blob/main/independence-days/independence_days.R).

I also recommend Ryo Nakagawara's [blog post on politely scraping websites](https://ryo-n7.github.io/2020-05-14-webscrape-soccer-data-with-R/), especially if you would like a more complex scraping example.

Which Wikipedia table will you analyze next?
