---
tags: ["package-development", "spatial", "maps", "dataedu"]
date: "2020-05-03"
title: "Creating an R Package for School District Shapefiles"
---

Blog post on {leaidr}, an R package for U.S. school district shapefiles.

<!--more-->



I would like to introduce [{leaidr}](https://github.com/ivelasq/leaidr), a package for mapping U.S. School District shapefiles!

Inspired by my coauthor [Joshua Rosenberg](https://joshuamrosenberg.com/), the goal of {leaidr} is to facilitate the download and use of school district shapefiles.

School districts in the U.S. have associated local education agency identification numbers (LEAID) used in the [National Center for Education Statistics (NCES) Common Core of Data](https://nces.ed.gov/pubs2010/100largest0809/tables/table_d05.asp). These are very useful because if you have other datasets with NCES ID's, then you can (sometimes easily) join them.

It can be very useful to visualize districts and associated data. District shapefiles are available in different places, such as through the [NCES](https://nces.ed.gov/programs/edge/Geographic/DistrictBoundaries) and [Stanford Education Data Archive](https://exhibits.stanford.edu/data/catalog/db586ns4974). The package {tigris} also has a school district option, but unfortunately it is missing a few district polygons.


```r
library(tigris)

ca <- tigris::school_districts(state = "06",
                               type = "unified")

plot(ca["GEOID"])
```

<img src="/blog/leaid-shapefiles_files/figure-html/unnamed-chunk-2-1.png" width="672" />

{leaidr} downloads NCES' U.S. district shapefile from Github using ROpenSci's [{piggyback}](https://github.com/ropensci/piggyback) package. This is a super helpful package, as Github caps file uploads at 100 MB (and the shapefile is ~170 MB). I originally tried Github Large File Storage (LFS), but it stores files as a hash, not as an actual file. Therefore, I couldn't figure out how to use it for a package that others can use.

The function `lea_get()` downloads an R Data file from the Github repo to your designated path and then writes the necessary shapefiles. Then, create an object with `lea_prep()` by designating where the shapefiles exist and which state(s) you would like. **Note:** For now, you must use the state's FIPS code. FIPS state codes are numeric and two-letter alphabetic codes to identify U.S. states and certain other associated areas. A reference table is found [here](https://www.mcc.co.mercer.pa.us/dps/state_fips_code_listing.htm).

Once you have the shapefile, then you can merge with other datasets and plot using packages like {leaflet} and {ggplot2}.

## Example

Let's walk through an example where we will merge external data to the shapefile and then map all the districts in California. The external data is from Josh's [`covidedu` project](https://github.com/making-data-science-count/covidedu), which scrapes district websites for specific words. In this case, the search terms were "covid\*", "coron\*", and "closure". I highly recommend using `covidedu` for easy scraping from a **lot** of district websites!

First, let's call our libraries.


```r
library(tidyverse)
# if you haven't installed the package yet
# devtools::install_github("ivelasq/leaidr")
library(leaidr)
library(maptools)
# if you don't have this downloaded
# install.packages("mapproj")
```

Time to get your data! Use {leaidr} to download and prep your shapefiles for California (FIPS == 06). Read in the external data (in this case, `summary-of-table-of-links.csv`).

**Note:** You must have a GitHub PAT set to run `lea_get()`. [Happy git with R](https://happygitwithr.com/github-pat.html) has a great walkthrough on how to do that.


```r
# download the shapefile into a designated folder
leaidr::lea_get(path = "./test")

# prep the shapefile for the state(s) you'd like
ca_shapefile <-
  leaidr::lea_prep(path = "./test", fips = "06")

# read in the external data that also has NCES ID's
# this is from the covidedu project
ca_data <-
  read_csv("https://raw.githubusercontent.com/making-data-science-count/covidedu/master/output/2020-04-29/summary-of-table-of-links.csv")
```

Join the CSV to the shapefile.


```r
ca_merge <-
  sp::merge(ca_shapefile, ca_data, by.x = "GEOID", by.y = "nces_id")
```

Now 'fortify' the data - this converts the polygons into points. This is so ggplot can create the plot.

If you get the error `isTRUE(gpclibPermitStatus()) is not TRUE`, then you need to enable `gpclib` by running `gpclibPermit()` (this is part of the {maptools} package, which should have been loaded above). Note that support for `gpclib` will be withdrawn from maptools at the next major release, so you might have to try something else if the package has been upgraded.

If you run `gpclibPermit()` and you keep getting `FALSE`, then you are missing the package {gpclib}. Install the package, then run `gpclibPermit()` to set it to `TRUE`.

(I don't know if this is the best/only way to do this - if anybody has suggestions, please let me know!)


```r
# install.packages("gpclib")
gpclibPermit()
ca_points <- fortify(ca_merge, region = "GEOID")
```

Now, join the points and the shapefile data.


```r
ca_df <- left_join(ca_merge@data, ca_points, by = c("GEOID" = "id"))
```

We can finally plot the shapefile and its data!


```r
ca_map <-
  ca_df %>% 
  ggplot() +
  geom_polygon(aes(x = long, 
                   y = lat, 
                   group = group,
                   fill = any_link_found),
               color = "gray", 
               size = .2) +
  theme_void() +
  scale_fill_iv() +
  ggtitle("COVID-Related Links Found on CA School District Sites")
```

To make a nicer looking map, then you can use `coord_map()`.


```r
map_projected <- ca_map +
  coord_map()

print(map_projected)
```

![](https://ivelasq.rbind.io/images/test_map.png)

Tada! A full school district map for California.

## Call for Collaboration

Please try out {leaidr}! I hope that it is useful to you in your work. I'd love any collaborators to join me in making it easier/better!

* **Other functionality**: Thinking of: being able to filter shapefiles by NCES IDs as well as states; adding commonly used data (like district demographics).
* **Issues**: If you run into any issues, please post on the [GitHub page!](https://github.com/ivelasq/leaidr/issues)

## Resources

* [**Joining Spatial Data**](http://www.nickeubank.com/wp-content/uploads/2015/10/RGIS2_MergingSpatialData_part1_Joins.html)
* [**Analyzing U.S. Census Data Using R**](https://rpubs.com/DanielSLee/censusMap)
