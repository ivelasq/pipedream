---
comments: false
date: "2018-12-16"
tags: ["import-pdf", "tidy", "visualization", "residuals"]
title: "Transforming PDFs Into Useful Tables"
---

Blog post on importing, tidying, and visualizing SNAP expenditure data.

<!--more-->



Way back in 2016, the USDA released a [study](https://www.fns.usda.gov/snap/foods-typically-purchased-supplemental-nutrition-assistance-program-snap-households) entitled "Foods Typically Purchased by Supplemental Nutrition Assistance Program (SNAP) Households" that included a summary, final report, and appendices. Per the USDA's description:

*"This study uses calendar year 2011 point-of-sale transaction data from a leading grocery retailer to examine the food choices of SNAP and non-SNAP households."*

At the time though, I was most interested in looking at the [appendices data](https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf) - _263_ pages full of tables detailing the commodities and categories of food bought by both families served and not served by SNAP. Unfortunately, these wonderful data are in PDF format, with 'fancy' Excel formatting (merged cells, unnecessary column names), where the formatting varies depending on which appendix you are looking at.

I [emailed](mailto:SNAPHQ-WEB@fns.usda.gov) SNAP HQ to ask if they had the raw data available in CSVs and was told simply:

*"Thank you for your inquiry. Unfortunately we do not have the data tables in a CSV file."*

At the time, my R skills were pretty rudimentary and I couldn't figure out how to easily and efficiently pull the data into usable tables. Two years later and with a little more experience with R and scraping and cleaning ugly files, I decided to try again using the {tidyverse} and {tabulizer} packages.


```r
library(tidyverse)
library(tabulizer)
```

We use `tabulizer::extract_tables()` to extract the data from the [appendices PDF](https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf). Once we extract the tables, we are left with a list (which is slightly more manageable than the original PDFs).


```r
snap_pdf <-
  extract_tables(
    "https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf"
  )
```



























