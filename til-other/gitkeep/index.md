---
title: "How to add .gitkeep to a bunch of folders"
date: '2022-08-12'
category: Other
output: html_document
---

I needed to add a bunch of folders to a GitHub repository. I knew their names but didn't have any documents for them yet.

GitHub only allows you to push folders that contain something. However, you can use `.gitkeep` files to make "empty" folders.

First, I created all the folders that I needed.

```R
letters <-
  c("a", "b", "c")

foldernames <-
  paste0("2022/", letters)
  
lapply(foldernames, dir.create, recursive = TRUE)
```

Next, I navigated to the new "2022" folder and created the `.gitkeep` files.

```bash
cd 2022

find . -type d -empty -not -path "./.git/*" -exec touch {}/.gitkeep
```