# pluck colors

# 1. setup ----
suppressPackageStartupMessages(library(here))
library(jsonlite)
library(knitr)
library(magrittr)
suppressPackageStartupMessages(library(tidyverse))

# 2. data ----
tnb_original <- fromJSON(here("blog", "positron-theme", "data", "tomorrow-night-bright-original.json"), flatten = TRUE)
gdd <- fromJSON(here("blog", "positron-theme", "data", "github-dark-default.json"), flatten = TRUE)
tnb_rclassic <- fromJSON(here("blog", "positron-theme", "data", "tomorrow-night-bright-r-classic.json"), flatten = TRUE)

# 3. functions ----
flatten_tokencolors <- function(x) {
  stopifnot(is.list(x))
  out <- vector(mode = "character", length = length(x))
  for (i in seq_along(x)) {
    if (length(x[[i]]) == 0) {
      out[i] <- NA_character_
    } else {
      out[i] <- str_flatten_comma(sort(x[[i]]))
    }
  }
  out
}

flatten_colors <- function(x) {
  stopifnot(is.list(x))
  out <- vector(mode = "character", length = length(x))
  for (i in seq_along(x)) {
    if (length(x[[i]]) == 1) {
      out[i] <- x[[i]]
    }
    if (length(x[[i]]) > 1) {
      out[i] <- str_flatten_comma(sort(x[[i]]))
    }
  }
  out
}

# 4. tomorrow night bright original ----
tnb_original_tokencolors <-
  tnb_original[["tokenColors"]] |>
  as_tibble() |>
  select(-name, -settings.fontStyle) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
    gutter = settings.gutter,
    gutterForeground = settings.gutterForeground
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground", "gutter", "gutterForeground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  mutate(
    scope = flatten_tokencolors(scope),
    indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)
  ) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

tnb_original_tokencolors2 <-
  tnb_original[["tokenColors"]] |>
  as_tibble() |>
  select(-name, -settings.fontStyle) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
    gutter = settings.gutter,
    gutterForeground = settings.gutterForeground
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground", "gutter", "gutterForeground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  unnest_longer(col = scope, keep_empty = TRUE) |>
  mutate(indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

tnb_original_tokencolors3 <-
  tnb_original_tokencolors2 |>
  filter(!is.na(scope)) |>
  pivot_wider(names_from = scope, values_from = scope, values_fn = list) |>
  mutate(across(3:last_col(), flatten_tokencolors)) |>
  unite(col = "scope", 3:last_col(), sep = ", ", na.rm = TRUE) |>
  bind_rows(tnb_original_tokencolors2 |> filter(is.na(scope))) |>
  mutate(indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)) |>
  arrange(indicator, color, setting) |>
  select(-indicator) |>
  relocate(color) |>
  mutate(color = str_to_lower(color))

tnb_original_colors <-
  enframe(tnb_original[["colors"]], name = "setting", value = "color") |>
  mutate(color = flatten_colors(color)) |>
  relocate(color) |>
  arrange(color, setting) |>
  mutate(color = str_to_lower(color))

# 5. github dark default ----
gdd_tokencolors <-
  gdd[["tokenColors"]] |>
  as_tibble() |>
  select(-settings.fontStyle, -settings.content) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  mutate(
    scope = flatten_tokencolors(scope),
    indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)
  ) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

gdd_tokencolors2 <-
  gdd[["tokenColors"]] |>
  as_tibble() |>
  select(-settings.fontStyle, -settings.content) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  unnest_longer(col = scope, keep_empty = TRUE) |>
  mutate(
    indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)
  ) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

gdd_tokencolors3 <-
  gdd_tokencolors2 |>
  filter(!is.na(scope)) |>
  pivot_wider(names_from = scope, values_from = scope, values_fn = list) |>
  mutate(across(3:last_col(), flatten_tokencolors)) |>
  unite(col = "scope", 3:last_col(), sep = ", ", na.rm = TRUE) |>
  arrange(color, setting) |>
  relocate(color) |>
  mutate(color = str_to_lower(color))

gdd_colors <-
  enframe(gdd[["colors"]], name = "setting", value = "color") |>
  mutate(color = flatten_colors(color)) |>
  relocate(color) |>
  arrange(color, setting) |>
  mutate(color = str_to_lower(color)) |>
  pivot_wider(names_from = setting, values_from = setting) |>
  unite(col = "setting", 2:last_col(), sep = ", ", na.rm = TRUE)

# 6. tomorrow night bright r classic ----
tnb_rclassic_tokencolors <-
  tnb_rclassic[["tokenColors"]] |>
  as_tibble() |>
  select(-name, -settings.fontStyle) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  mutate(
    scope = flatten_tokencolors(scope),
    indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)
  ) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

tnb_rclassic_tokencolors2 <-
  tnb_rclassic[["tokenColors"]] |>
  as_tibble() |>
  select(-name, -settings.fontStyle) |>
  rename(
    background = settings.background,
    foreground = settings.foreground,
  ) |>
  pivot_longer(
    cols = all_of(c("background", "foreground")),
    names_to = "setting",
    values_to = "color"
  ) |>
  filter(!is.na(color)) |>
  unnest_longer(col = scope, keep_empty = TRUE) |>
  mutate(
    indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)
  ) |>
  arrange(indicator, scope, setting) |>
  select(-indicator)

tnb_rclassic_tokencolors3 <-
  tnb_rclassic_tokencolors2 |>
  filter(!is.na(scope)) |>
  pivot_wider(names_from = scope, values_from = scope, values_fn = list) |>
  mutate(across(3:last_col(), flatten_tokencolors)) |>
  unite(col = "scope", 3:last_col(), sep = ", ", na.rm = TRUE) |>
  bind_rows(tnb_rclassic_tokencolors2 |> filter(is.na(scope))) |>
  mutate(indicator = case_when(is.na(scope) ~ 1, TRUE ~ NA)) |>
  arrange(indicator, color, setting) |>
  select(-indicator) |>
  relocate(color) |>
  mutate(color = str_to_lower(color))

tnb_rclassic_colors <-
  enframe(tnb_rclassic[["colors"]], name = "setting", value = "color") |>
  mutate(color = flatten_colors(color)) |>
  relocate(color) |>
  arrange(color, setting) |>
  mutate(color = str_to_lower(color)) |>
  pivot_wider(names_from = setting, values_from = setting) |>
  unite(col = "setting", 2:last_col(), sep = ", ", na.rm = TRUE)
