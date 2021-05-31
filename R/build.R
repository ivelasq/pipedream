iv_palette <- c(
  `blue`   = "#0081e8",
  `purple1`  = "#9597f0",
  `purple2`      = "#d4b4f6",
  `purple3` = "#ffd6ff",
  `pink1`     = "#ffa1d4",
  `pink2` = "#ff688c",
  `red` = "#fb372d"
)

iv_colors <- function(...) {
  cols <- c(...)
  
  if (is.null(cols)) {
    return(iv_palette)
  }
  
  iv_palette[cols]
}

iv_colors()

iv_palettes <- list(
  `short` = iv_colors("blue", "purple2", "red"),
  `main` = iv_colors("blue", "purple1", "purple2", "purple3", "pink1", "pink2", "red")
)

iv_pal <- function(palette = "main", reverse = FALSE, ...) {
  pal <- iv_palettes[[palette]]
  
  if (reverse) pal <- rev(pal)
  
  grDevices::colorRampPalette(pal, ...)
}

scale_color_iv <- function(palette = "main", discrete = TRUE, reverse = FALSE, ...) {
  pal <- iv_pal(palette = palette, reverse = reverse)
  
  if (discrete) {
    ggplot2::discrete_scale("colour", paste0("iv_", palette), palette = pal, ...)
  } else {
    ggplot2::scale_color_gradientn(colours = pal(256), ...)
  }
}

scale_fill_iv <- function(palette = "main", discrete = TRUE, reverse = FALSE, ...) {
  pal <- iv_pal(palette = palette, reverse = reverse)
  
  if (discrete) {
    ggplot2::discrete_scale("fill", paste0("iv_", palette), palette = pal, ...)
  } else {
    ggplot2::scale_fill_gradientn(colours = pal(256), ...)
  }
}

theme_iv <- function() {
  ggplot2::theme_minimal(base_size = 11,
                         base_family = "Lato")
}
