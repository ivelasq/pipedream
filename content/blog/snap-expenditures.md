---
comments: false
date: "2018-12-16"
tags: ["import-pdf", "tidy", "visualization", "residuals"]
title: "Transforming PDF's into Useful Tables"
---

Blog post on importing, tidying, and visualizing SNAP expenditure data.

<!--more-->

Way back in 2016, the USDA released a [study](https://www.fns.usda.gov/snap/foods-typically-purchased-supplemental-nutrition-assistance-program-snap-households) entitled “Foods Typically Purchased by Supplemental Nutrition Assistance Program (SNAP) Households,” including a summary, final report, and appendices. Per the USDA’s description:

> This study uses calendar year 2011 point-of-sale transaction data from a leading grocery retailer to examine the food choices of SNAP and non-SNAP households.

At the time though, I was most interested in looking at the [appendices data](https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf) - *263* pages full of tables detailing the commodities and categories of food bought by both families served and not served by SNAP. Unfortunately, these wonderful data are in PDF format, with ‘fancy’ Excel formatting (merged cells, unnecessary column names), where the formatting varies depending on which appendix you are looking at.

I [emailed](mailto:SNAPHQ-WEB@fns.usda.gov) SNAP HQ to ask if they had the raw data available in CSV’s and was told simply:

> Thank you for your inquiry. Unfortunately we do not have the data tables in a CSV file.

At the time, my R skills were pretty rudimentary and I couldn’t figure out how to easily and efficiently pull the data into usable tables. Two years later and with a little more experience with R and scraping and cleaning ugly files, I decided to try again using the wonderful {tidyverse} and {tabulizer} packages.

``` r
library(tidyverse)
library(tabulizer)
library(broom)
```

Use `tabulizer::extract_tables()` to extract the data from the [appendices PDF](https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf). Once you extract the tables, you are left with a list (which is slightly more manageable than the original PDFs).

``` r
snap_pdf <-
  extract_tables("https://fns-prod.azureedge.net/sites/default/files/ops/SNAPFoodsTypicallyPurchased-Appendices.pdf")
```

Using the {purrr} package, create a data frame from the lists while simultaneously removing the unnecessary rows.

``` r
snap_df <- 
  snap_pdf %>%
  map(as_tibble) %>%
  map_df(~ slice(., -2)) # slicing because of the unnecessary rows
  
head(snap_df)
```

    ## # A tibble: 6 x 9
    ##   V1          V2    V3                       V4    V5    V6    V7    V8    V9   
    ##   <chr>       <chr> <chr>                    <chr> <chr> <chr> <chr> <chr> <chr>
    ## 1 ""          ""    SNAP Household Expendit… <NA>  <NA>  <NA>  <NA>  <NA>  <NA> 
    ## 2 "Soft drin… ""    1 $357.7 5.44% 2 $1,263… <NA>  <NA>  <NA>  <NA>  <NA>  <NA> 
    ## 3 "Fluid mil… ""    2 $253.7 3.85% 1 $1,270… <NA>  <NA>  <NA>  <NA>  <NA>  <NA> 
    ## 4 "Beef:grin… ""    3 $201.0 3.05% 6 $621.1… <NA>  <NA>  <NA>  <NA>  <NA>  <NA> 
    ## 5 "Bag snack… ""    4 $199.3 3.03% 5 $793.9… <NA>  <NA>  <NA>  <NA>  <NA>  <NA> 
    ## 6 "Cheese"    ""    5 $186.4 2.83% 3 $948.9… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>

Due to the original formatting of the PDFs, there’s a bunch of cleaning to be done to make the list into a usable table. Using `slice()`, I choose only the rows from Appendix 1. I manually put in the number of entries (238) because I didn’t know how to calculate this using code. If you have ideas, let me know!

``` r
snap_appendix1 <-
  snap_df %>% 
  slice(1:238) # Appendix A has 238 rows
```

Now comes the fun part (yay data cleaning!). When looking at the data frame, the data for each commodity are all mushed together in two separate columns (V2 and V3), but only one column or the other. Then there are a bunch of empty columns (V4 through V9), probably created from the funky original formatting. The data all begin with numbers as well. First things first - put all the data in a single column. Then, remove all the empty rows in the newly created `col_dat` column.

``` r
snap_appendix1_cleaned <-
  snap_appendix1 %>%
  mutate(col_dat = case_when(grepl("[0-9]", V2) ~ V2, # create a column that contains all the data
                           grepl("[0-9]", V3) ~ V3,
                           TRUE ~ "")) %>% 
  filter(col_dat != "") # some rows are empty

head(snap_appendix1_cleaned)
```

    ## # A tibble: 6 x 10
    ##   V1        V2    V3           V4    V5    V6    V7    V8    V9    col_dat      
    ##   <chr>     <chr> <chr>        <chr> <chr> <chr> <chr> <chr> <chr> <chr>        
    ## 1 Soft dri… ""    1 $357.7 5.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  1 $357.7 5.4…
    ## 2 Fluid mi… ""    2 $253.7 3.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  2 $253.7 3.8…
    ## 3 Beef:gri… ""    3 $201.0 3.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  3 $201.0 3.0…
    ## 4 Bag snac… ""    4 $199.3 3.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  4 $199.3 3.0…
    ## 5 Cheese    ""    5 $186.4 2.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  5 $186.4 2.8…
    ## 6 Baked br… ""    6 $163.7 2.… <NA>  <NA>  <NA>  <NA>  <NA>  <NA>  6 $163.7 2.4…

Now the numeric data we want is wonderfully in a single column, so we can select the columns `V1` and `col_dat`.

``` r
snap_appendix1_cleaned <-
  snap_appendix1_cleaned %>% 
  select(V1, col_dat)

head(snap_appendix1_cleaned)
```

    ## # A tibble: 6 x 2
    ##   V1                  col_dat                        
    ##   <chr>               <chr>                          
    ## 1 Soft drinks         1 $357.7 5.44% 2 $1,263.3 4.01%
    ## 2 Fluid milk products 2 $253.7 3.85% 1 $1,270.3 4.03%
    ## 3 Beef:grinds         3 $201.0 3.05% 6 $621.1 1.97%  
    ## 4 Bag snacks          4 $199.3 3.03% 5 $793.9 2.52%  
    ## 5 Cheese              5 $186.4 2.83% 3 $948.9 3.01%  
    ## 6 Baked breads        6 $163.7 2.49% 4 $874.8 2.78%

All the numeric data is still mushed in column `col_dat`, so using `tidyr::separate()` we can split the values because they are all separated by spaces. Referencing the original PDF, we descriptively rename the columns (and rename the commodity column `V1` as well). The numeric values have retained their original formatting, with dollar signs and commas and percentage signs, oh my! We can sub out those unnecessary characters and transform those columns into truly numeric values.

``` r
snap_appendix1_cleaned <-
  snap_appendix1_cleaned %>%
  separate(col_dat, " ",
           into = c("snap_rank", "snap_dollars_in_millions", "snap_pct_total_expenditures", "nonsnap_rank", "nonsnap_dollars_in_millions", "nonsnap_pct_total_expenditures")) %>%
  rename(commodity = V1) %>%
  mutate_at(vars(snap_rank:nonsnap_pct_total_expenditures), list(~ as.numeric(gsub(",|%|\\$", "", .))))

head(snap_appendix1_cleaned)
```

    ## # A tibble: 6 x 7
    ##   commodity      snap_rank snap_dollars_in_mi… snap_pct_total_expe… nonsnap_rank
    ##   <chr>              <dbl>               <dbl>                <dbl>        <dbl>
    ## 1 Soft drinks            1                358.                 5.44            2
    ## 2 Fluid milk pr…         2                254.                 3.85            1
    ## 3 Beef:grinds            3                201                  3.05            6
    ## 4 Bag snacks             4                199.                 3.03            5
    ## 5 Cheese                 5                186.                 2.83            3
    ## 6 Baked breads           6                164.                 2.49            4
    ## # … with 2 more variables: nonsnap_dollars_in_millions <dbl>,
    ## #   nonsnap_pct_total_expenditures <dbl>

Last but not least, we convert all the columns with percentages into actual percentages by dividing by 100.

``` r
snap_appendix1_cleaned <-
  snap_appendix1_cleaned %>%
  mutate_at(vars(contains("pct")), list(~ ./100))

head(snap_appendix1_cleaned)
```

    ## # A tibble: 6 x 7
    ##   commodity      snap_rank snap_dollars_in_mi… snap_pct_total_expe… nonsnap_rank
    ##   <chr>              <dbl>               <dbl>                <dbl>        <dbl>
    ## 1 Soft drinks            1                358.               0.0544            2
    ## 2 Fluid milk pr…         2                254.               0.0385            1
    ## 3 Beef:grinds            3                201                0.0305            6
    ## 4 Bag snacks             4                199.               0.0303            5
    ## 5 Cheese                 5                186.               0.0283            3
    ## 6 Baked breads           6                164.               0.0249            4
    ## # … with 2 more variables: nonsnap_dollars_in_millions <dbl>,
    ## #   nonsnap_pct_total_expenditures <dbl>

Tada! Now we have a clean dataset from the original not-very-usable PDFs.

Another goal is to at some point do a full analysis of what these data show. My hope is that now some of it is available, others can create and share amazing analysis with it. For the purposes of this blogpost, here are some quick ggplots comparing the rank of commodities between families served by SNAP and those who are not.

``` r
snap_appendix1_cleaned %>% # quick correlation plot
  ggplot(aes(x = snap_rank, y = nonsnap_rank)) +
  geom_point(color = "#00C3DA") +
  theme_iv() # custom theme
```

<img src="/blog/snap-expenditures_files/figure-html/unnamed-chunk-11-1.png" width="672" style="display: block; margin: auto;" />

``` r
snap_lm <- lm(snap_rank ~ nonsnap_rank, data = snap_appendix1_cleaned)
snap_res <- augment(snap_lm)

snap_res %>% # quick residual plot
  ggplot(aes(x = .fitted, y = .resid)) +
  geom_point(color = "#00C3DA") +
  theme_iv() # custom theme
```

<img src="/blog/snap-expenditures_files/figure-html/unnamed-chunk-11-2.png" width="672" style="display: block; margin: auto;" />

I’d love to collaborate with others to finish up this project and find more efficient ways of cleaning these data. The repo with the code and final dataset is [here](https://github.com/ivelasq/snap). More to come!

*Liked this article? I’d love for you to retweet!*

<center>
{{% tweet "1074704678858973184" %}}
</center>
