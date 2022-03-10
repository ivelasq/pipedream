---
title: "Remote pair programming in R using Visual Studio Code and Live Share"
date: '2021-02-03'
categories: ["pair-program"]
description: "Setting up a Google Docs-like coding environment in VS Code."
image: thumbnail.jpg
author:
  - "Isabella Velásquez"
  - "Gustavo E. Velásquez"
---

![Edgar Degas, Dancers Practicing at the Barre (1877)](thumbnail-wide.jpg)

-   [The Problem](#the-problem)
-   [State of the Code Editors](#state-of-the-code-editors)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Writing an R Package Using VS Code](#writing-an-r-package-using-vs-code)
-   [Live Share Tutorial](#live-share-tutorial)
-   [Final Thoughts](#final-thoughts)

## The problem

Way back in the [Before Time](https://www.urbandictionary.com/define.php?term=The%20Before%20Time), my [older brother](https://github.com/gvelasq) and I worked together on an R package called [{wizehiver}](https://ivelasq.github.io/wizehiver). To collaborate, we used many tools. We had an email thread (of over 35 emails!) that eventually became two email threads. We tried [GitHub Issues](https://github.com/ivelasq/wizehiver/issues?q=is%3Aissue+is%3Aclosed), but we were in such close communication that the back-and-forth on issues was ineffectual. We also tried [pair programming](https://en.m.wikipedia.org/wiki/Pair_programming) but since we lived in separate cities, we did it while one of us would share our screen on Skype. We wished there was a better, more hands-on, and immediate way to collaborate in a source code editor in [real-time](https://en.wikipedia.org/wiki/Collaborative_real-time_editor), similar to how seamless it is to work on Google Docs.

## State of the code editors

The [RStudio IDE](https://rstudio.com/products/rstudio) is in our opinion the best IDE for R out there; however, live collaboration using RStudio’s [Project Sharing](https://docs.rstudio.com/ide/server-pro/r-sessions.html#project-sharing) feature is limited to those with a paid [RStudio Server Pro](https://rstudio.com/pricing) license as of this writing. There are many source code editors out there, and notably [Atom](https://atom.io/packages/teletype) and [Visual Studio (VS) Code](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) both provide extensions for free, collaborative real-time editing.

We have been following, with increasing [interest](https://github.com/issues?q=vscode+OR+radian+OR+languageserver+OR+vscDebugger+is%3Aissue+author%3Agvelasq), the growing community of developers who have been focused on tools for R in VS Code. There are now several R packages, VS Code extensions, and a command-line R console available, as well as several tutorials dedicated to R in VS Code. Here we set out to see if VS Code could fill the particular gap we identified in our previous work together — the need for seamless remote pair programming. A few of our use cases are:

1.  We wanted to collaborate on this blog post in a shared `.Rmd` file which we could edit and knit as we wrote. Ultimately we wrote most of this post on Google Docs before transferring it to a versioned `.Rmd` on GitHub for finishing touches.

2.  We wanted to start collaborating on an open-source R package [{mutagen}](https://github.com/gvelasq/mutagen) which will (someday) provide useful extensions to [{dplyr}](https://dplyr.tidyverse.org/)’s [`mutate()`](https://dplyr.tidyverse.org/reference/mutate.html):

<center>
![](https://raw.githubusercontent.com/gvelasq/mutagen/master/man/figures/logo.jpeg)
</center>

So far, we only have a hex sticker — [\#hexdrivendevelopment](https://twitter.com/search?q=%23hexdrivendevelopment) in action!

<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">but... I... already... know... how... the... hexsticker... should... look...</p>&mdash; Thomas Lin Pedersen (@thomasp85) <a href="https://twitter.com/thomasp85/status/1022413631340912640?ref_src=twsrc%5Etfw">July 26, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

Embarrassingly, our last commit to the package was in December 2019. While it would be convenient to blame the pandemic, it was a mix of being busy and other ‘hobby’ projects. However, having a synchronous way of collaborating—where we could see the package being built in action—would enable us to truly get the project underway. Before we begin the tutorial, first we have a public service announcement: if you would like to see Microsoft devote additional resources to support R in VS Code, please upvote R in this `vscode-jupyter` [issue](https://github.com/microsoft/vscode-jupyter/issues/1536)!

## Installation

We’re going to use [Homebrew](https://brew.sh/) to facilitate installation steps on macOS. We only provide instructions for macOS here, but we do provide links for macOS users who prefer to install applications using the point-and-click method, and for Linux and Windows users to find the correct binaries. We also indicate which steps are optional.

1.  Open Applications &gt; Utilities &gt; Terminal.

2.  Install [Homebrew](https://brew.sh/) using the terminal command below, also provided on the Homebrew landing page. Paste this code into your terminal:

``` zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

1.  (Optional) For our favorite free and open-source terminal on macOS, install [iTerm2](https://iterm2.com/) by pasting this into your terminal:

``` zsh
brew install --cask iterm2
```

1.  If you don’t have them already, you’ll need [R](https://cloud.r-project.org/) and [RStudio Desktop](https://rstudio.com/products/rstudio/download/preview/). We’re partial to the preview version of RStudio Desktop which has all the latest features. You can install (and update) them easily from your terminal:

``` zsh
brew install --cask r
brew tap homebrew/cask-versions
brew install --cask rstudio-preview
```

1.  Install [`radian`](https://github.com/randy3k/radian), a ‘21st century R console’ and the recommended R console for VS Code.

*Update 2021-02-11*: Thanks to the efforts of [`@jdblischak`](https://twitter.com/jdblischak) and [`@randy3k`](https://github.com/randy3k) in this closed [issue](https://github.com/randy3k/radian/issues/244), `radian` can now be installed with [`conda-forge`](https://anaconda.org/conda-forge/radian) instead of only with [`pip`](https://pypi.org/project/radian/). Most data science tutorials recommend using Python with [`conda`](https://docs.conda.io/projects/conda/en/latest) environments, so we suspect that our readers will be more familiar with using `conda` than `pip`, as we are. If you do choose to use `pip` (or [`python -m pip`](https://snarky.ca/why-you-should-use-python-m-pip/)), beware that `pip` [should be used carefully](https://www.anaconda.com/blog/using-pip-in-a-conda-environment) inside `conda` environments.

The steps below first install [Miniforge](https://github.com/conda-forge/miniforge), which we prefer to [Miniconda](https://docs.conda.io/en/latest/miniconda.html) since it sets `conda-forge` as the default channel, then create an empty `conda` environment named `r-console` into which we install `radian` and [`jedi`](https://anaconda.org/conda-forge/jedi). `jedi` is an optional package that enables Python autocompletion using the [{reticulate}](https://rstudio.github.io/reticulate/) R package. Paste this into your terminal:

``` zsh
brew install miniforge
conda create --name r-console
conda activate r-console
conda install radian
conda install jedi # for {reticulate} python autocompletion
```

1.  In RStudio, install the required R packages for VS Code, namely [{languageserver}](https://github.com/REditorSupport/languageserver) from CRAN and the latest GitHub release of [{vscDebugger}](https://github.com/ManuelHentschel/vscDebugger):

``` r
install.packages("languageserver")
remotes::install_github("ManuelHentschel/vscDebugger", ref = remotes::github_release())
```

For the tutorial, make sure that you have the following R packages installed, if you don’t already:

``` r
install.packages("devtools")
install.packages("dplyr")
install.packages("purrr")
install.packages("tibble")
install.packages("usethis")
install.packages("vctrs")
```

1.  Install [VS Code](https://code.visualstudio.com/) by pasting this into your terminal:

``` zsh
brew install --cask visual-studio-code
```

1.  Open VS Code and install the following extensions from the Extensions gallery (`Shift-Command-X`):

<!-- -->

1.  [R](https://marketplace.visualstudio.com/items?itemName=Ikuyadeu.r)
2.  [R LSP Client](https://marketplace.visualstudio.com/items?itemName=REditorSupport.r-lsp)
3.  [R Debugger](https://marketplace.visualstudio.com/items?itemName=RDebugger.r-debugger)
4.  [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)
5.  [Live Share Audio](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-audio)

## Configuration

1.  Make sure the `r-console` environment is still active in your terminal. If it is, your terminal prompt will look like this, or similar:

``` zsh
(r-console) ~ %
```

If not, then reactivate the `r-console` environment:

``` zsh
conda activate r-console
```

1.  Type `which radian` in your terminal to display the path to the `radian` executable. Below is what it is on our local machines. Copy the path to your clipboard.

``` zsh
/usr/local/Caskroom/miniforge/base/envs/r-console/bin/radian
```

1.  Determine whether `bash` or `zsh` is your default shell. If you don’t know, type this into your terminal:

``` zsh
echo $SHELL
```

Older Macs may still use `bash`, while newer Macs or those with older Macs who have created new user accounts since upgrading to macOS Catalina will likely run `zsh`, the [new default macOS shell](https://scriptingosx.com/2019/06/moving-to-zsh).

1.  Let’s take VS Code for a spin! An useful feature to know about is that typing `code <path/file.ext>` in your terminal will open a new or existing file in VS Code at the path you specify. Many more details are available in the help page `code -h`. Depending on whether your default shell is `bash` or `zsh`, type `code ~/.bashrc` or `code ~/.zshrc` in your terminal to open your shell configuration file, and paste the path you copied in step 2. above to add an alias to `radian` and bind it to lowercase `r`:

``` zsh
alias r="/usr/local/Caskroom/miniforge/base/envs/r-console/bin/radian"
```

You can paste the alias anywhere in the file, but it is probably best to paste it at the very bottom, and avoid inserting it in any preexisting code blocks (e.g., `conda initialize` blocks) which may be overwritten. Save your configuration file and restart your terminal for the settings to take effect. Now all you need to open `radian` is to type `r` in any terminal (Terminal, iTerm2, RStudio, or VS Code)! Useful `radian` commands to know are:

``` zsh
q() # to exit R, same as with vanilla R and RStudio
;   # to enter shell mode, exit by pressing backspace on an empty line
~   # to enter {reticulate} python mode, exit by pressing backspace on an empty line
```

1.  To configure your `.Rprofile`, type `code ~/.Rprofile` in your terminal, or if you are already set up with [{usethis}](https://usethis.r-lib.org) in RStudio, run the R command [`usethis::edit_r_profile()`](https://usethis.r-lib.org/reference/edit.html). At a minimum, you will want to enable [{rstudioapi}](https://rstudio.github.io/rstudioapi) [emulation](https://github.com/Ikuyadeu/vscode-R/wiki/RStudio-addin-support) in VS Code:

``` r
options(vsc.rstudioapi = TRUE)
```

1.  To configure `radian`, type `code ~/.radian_profile` in your terminal which will open up a new blank editor and create a new file named `.radian_profile` in the home directory. This is our [`.radian_profile`](https://github.com/gvelasq/dotfiles/blob/master/radian/.radian_profile):

``` r
options(
    radian.insert_new_line = FALSE,
    radian.escape_key_map = list(
        list(key = "-", value = " <- "),
        list(key = "m", value = " %>% ")
    )
)
```

Save `~/.radian_profile` and restart your terminal for the settings to take effect.

1.  Now we’ll configure VS Code settings. Open VS Code, and navigate to `settings.json` by using the Command Palette (`Shift-Command-P`) and navigating to `Preferences: Open Settings (JSON)`. This is our [`settings.json`](https://github.com/gvelasq/dotfiles/blob/master/vscode/settings.json):

``` json
{
    // Liveshare: Prompt when receiving focus requests
    "liveshare.focusBehavior": "prompt",
    // R: Treat`names.like.this` as one word for selection
    "[r]": {
        "editor.wordSeparators": "`~!@#%$^&*()-=+[{]}\\|;:'\",<>/?"
    },
    // R: Use active terminal for all commands
    "r.alwaysUseActiveTerminal": true,
    // R: Use bracketed paste mode when sending code to console (radian)
    "r.bracketedPaste": true,
    // R: R or radian path for macOS
    "r.rterm.mac": "/usr/local/Caskroom/miniforge/base/envs/r-console/bin/radian",
    // R: Enable R session watcher (experimental)
    "r.sessionWatcher": true,
    // R: Remove hidden items when clearing R workspace
    "r.workspaceViewer.removeHiddenItems": true,
    // Telemetry: Disable Microsoft crash reporter
    "telemetry.enableCrashReporter": false,
    // Telemetry: Disable Microsoft telemetry
    "telemetry.enableTelemetry": false,
    // Terminal: Path to integrated shell on macOS
    "terminal.integrated.shell.osx": "/bin/zsh"
}
```

*NOTE:* The `r.rterm.mac` field above should be the path to `radian` if you followed the `radian` installation instructions above, otherwise it should be the path to your `R` executable (if you don’t know it, type `which R` in your terminal). Since we use Homebrew to install the latest `zsh` using `brew install zsh`, the path to our `zsh` is `/usr/local/bin/zsh`, but we have put `/bin/zsh` above since that is the default `zsh` location for most macOS users. You should run `which r` and `which zsh` to confirm your local settings are correct.

1.  Below are some useful [keyboard shortcuts](https://github.com/Ikuyadeu/vscode-R/wiki/Keyboard-shortcuts) for `keybindings.json`, found by using the Command Palette (`Shift-Command-P`) in VS Code and navigating to `Preferences: Open Keyboard Shortcuts (JSON)`. This is our [`keybindings.json`](https://github.com/gvelasq/dotfiles/blob/master/vscode/keybindings.json):

``` json
[
    {
        "description": "View: Show R Workspace",
        "key": "alt+r",
        "command": "workbench.view.extension.workspaceViewer"
    },
    {
        "description": "R: Create R Terminal",
        "key": "alt+`",
        "command": "r.createRTerm"
    },
    {
        "description": "R: Insert Assignment Operator",
        "key": "alt+-",
        "command": "type",
        "when": "editorLangId == r || editorLangId == rmd && editorTextFocus",
        "args": { "text": " <- " }
    },
    {
        "description": "R: Insert Pipe Operator",
        "key": "shift+cmd+m",
        "command": "type",
        "when": "editorLangId == r || editorLangId == rmd && editorTextFocus",
        "args": { "text": " %>% " }
    },
    {
        "description": "R: Insert Assignment Pipe Operator",
        "key": "shift+cmd+,",
        "command": "type",
        "when": "editorLangId == r || editorLangId == rmd && editorTextFocus",
        "args": { "text": " %<>% " }
    },
    {
        "description": "R: Insert Tee Pipe Operator",
        "key": "shift+cmd+.",
        "command": "type",
        "when": "editorLangId == r || editorLangId == rmd && editorTextFocus",
        "args": { "text": " %T>% " }
    },
    {
        "description": "R: Test Package",
        "key": "shift+cmd+8",
        "command": "r.test"
    },
    {
        "description": "R: Document",
        "key": "shift+cmd+9",
        "command": "r.document"
    },
    {
        "description": "R: Load All",
        "key": "shift+cmd+0",
        "command": "r.loadAll",
    }
]
```

## Writing an R Package using VS Code

In this section we’re going to set up a toy R package in VS Code, and in the next section we will enable Live Share.

1.  Open VS Code and use the Command Palette (`Shift-Command-P`) to navigate to `R: Create R Terminal`, or use the suggested keyboard shortcut above (`` Option-` ``). Note that if you have an editor open and the focus is on the editor, for the shortcut to work you may first need to use `` Control-` `` for `View: Toggle Integrated Terminal` followed by `` Option-` `` for `R: Create R Terminal`. If our configuration above worked for you, these commands should open a terminal instance with the `radian` console, and the title of the terminal should be `1: R Interactive` (or `2: R Interactive` if it’s the second active terminal).

2.  In the VS Code R console, create a {mutagen} package folder on your Desktop, declare dependencies, and start an R script for a new function `cast_integers()`:

``` r
library(usethis)
create_package("~/Desktop/mutagen")
deps <- c("dplyr", "purrr", "tibble", "vctrs")
purrr::walk(deps, use_package)
use_r("cast_integers")
```

1.  In VS Code, open the {mutagen} folder using File &gt; Open… (`Command-O`) and selecting the `mutagen` folder in the Desktop. This will open a new VS Code instance and the title bar will read `Welcome — mutagen`. The R extension icon will be visible on the sidebar since VS Code will detect the `.R` file in the folder.

2.  Use the Explorer icon in the sidebar (`Shift-Command-E`) and open the `cast_integers.R` file. Paste the following code into the editor and save the file:

``` r
#' Safely cast numeric columns to integers
#'
#' `cast_integers()` casts all eligible numeric columns in a data frame to integers, without data loss, using `vctrs::vec_cast()` for coercion.
#' @param .data A data frame
#' @return A tibble. If the input data frame has rownames, these will be preserved in a new rowname column.
#' @examples (mtcars_integerized <- cast_integers(mtcars))
#' @export
cast_integers <- function(.data) {
    stopifnot(is.data.frame(.data))
    .data <- tibble::rownames_to_column(.data)
    .data <- tibble::as_tibble(.data)
    int_index <- purrr::map_lgl(
        .data,
        ~ !inherits(try(vctrs::vec_cast(.x, to = integer()), silent = TRUE), "try-error")
    )
    .data <- dplyr::mutate(
        .data,
        dplyr::across(
            .cols = any_of(names(which(int_index))),
            .fns = ~ vctrs::vec_cast(.x, to = integer())
        )
    )
    return(.data)
}
```

1.  Now create a new R console in VS Code using either the keyboard shortcuts (`` Control-` `` to toggle the terminal and `` Option-` `` to create an R console) or by opening the Command Palette (`Shift-Command-P`) and navigating to `R: Create R Terminal`. Focus your view on the R extension by clicking R the sidebar (`Option-R`), and now test out the package. Below are a series of R console commands to familiarize you with the package development workflow in VS Code. We will load the package, document it, and create a new object in the R workspace that uses the new function we just loaded onto the package environment. To get familiar with the VS Code user interface, we will also print the object in the console, view it with the data viewer, and check out the help file for our new function.

``` r
library(dplyr)
devtools::load_all() # or Shift-Command-0 using keyboard shortcuts above
devtools::document() # or Shift-Command-9 using keyboard shortcuts above
mtcars_integerized <- mtcars %>% cast_integers()
mtcars_integerized
View(mtcars_integerized)
?cast_integers
```

## Live share tutorial

Now that we’ve started writing our R package in VS Code, it’s time to Live Share! Microsoft has a handy walkthrough [here](https://docs.microsoft.com/en-us/visualstudio/liveshare/use/vscode), but we will explain what we did and detail R project idiosyncrasies that we found.

In order to host a Live Share collaboration session, first you’ll need to sign into Visual Studio Live Share. Click on the `Live Share` status bar item or press `Shift-Command-P` and navigate to `Live Share: Sign In With Browser`. A notification will appear asking you to sign into either a Microsoft or GitHub account using your default web browser.

Once you are signed in, open a folder or file for pair programming. For package development, this would be the project folder for the package (e.g., the {mutagen} folder we created above). Click the `Live Share` status bar item or type `Shift-Command-P` and navigate to `Live Share: Start Collaboration Session (Share)`. An invite link will be copied automatically to your clipboard. You can send this link to your collaborator(s) and allow them to join a new session that shares the contents of the folder. Once a collaborator clicks the link, a notification will prompt you to approve the guest before they can join. Please note that guests do not necessarily need to be signed into to collaborate using Live Share, since anonymous guests are allowed; however, the host will need to be signed in. In fact, [guests don’t even need to have VS Code installed and can join Live Share from a browser](https://docs.microsoft.com/en-us/visualstudio/liveshare/quickstart/browser-join)!

Once a guest has joined a collaboration session, all collaborators will immediately be able to see each other’s cursors, edits, and selections in real-time. You can pick a file from the Explorer (`Shift-Command-E`) and start editing. Both hosts and guests will see edits as they are made.

As we worked on {mutagen} files, we noticed the usual loading of a package in development, via `devtools::load_all()`, or sourcing an entire file using `Shift-Command-S` (the VS Code version of RStudio’s `Shift-Command-Enter`), will not work for the guest. Why? Because the path to the folder directory is different for the host and guest. In our example, instead of the host’s path `~/Desktop/mutagen/R/cast_integers.R`, the guest’s path was an abbreviated `/R/cast_integers.R`, which led to errors when loading and sourcing from keyboard shortcuts. However, the guest can still run the code themselves (such as by selecting and running the source code in an R script, or using `Command-Enter` line by line) as long as they do not try to source the entire package. We did not try to abstract the path-generating rules for the guests’ Live Share instance into new keyboard shortcuts, but this seems like a solvable problem to allow guests to run `devtools::load_all()` or `source()` with minor modifications. Another gotcha was the R workspace; we tried to toggle the setting `"liveshare.publishWorkspaceInfo": true` in `settings.json`, but it did not let us share the R workspace between host and guest. It appears that for now host and guest(s) can only maintain separate R workspaces, though it would be useful to have the option to share the R s and its objects.

## Final thoughts

We’re excited for the future of R programming in VS Code. Live Share is an outstanding innovation for collaborative real-time editing, and is only one of the many amazing features in VS Code. Here we have only scratched the surface of use cases for Live Share. Microsoft keeps a running list of [many other Live Share use cases](https://docs.microsoft.com/en-us/visualstudio/liveshare/reference/use-cases).

We are also huge fans of RStudio and the RStudio IDE. On our wish list for RStudio is that a live collaboration feature be supported in future versions of RStudio Desktop (not only the Pro version) and RStudio Cloud. Having many excellent options is a good thing! In the meantime, it is clear that VS Code is maturing into a capable IDE for R. Live Share is an attractive and free feature that enables real-time collaboration for the masses and that we hope others will enjoy as much as we have.

<center>
*Liked this post? I'd love for you to retweet!*

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🎉📢🎉 Collaborating in <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a>? Git got you down? Want to code with others remotely, in real-time, and for free (à la Google Docs)? Check out how to set up and use <a href="https://twitter.com/code?ref_src=twsrc%5Etfw">@code</a> (<a href="https://twitter.com/hashtag/vscode?src=hash&amp;ref_src=twsrc%5Etfw">#vscode</a>) and <a href="https://twitter.com/hashtag/vsliveshare?src=hash&amp;ref_src=twsrc%5Etfw">#vsliveshare</a> for remote <a href="https://twitter.com/hashtag/pairprogramming?src=hash&amp;ref_src=twsrc%5Etfw">#pairprogramming</a> 🤝 in R! 🤯. Tutorial here: <a href="https://t.co/Qbrw71V77Z">https://t.co/Qbrw71V77Z</a> <a href="https://t.co/3sy9hAJea7">pic.twitter.com/3sy9hAJea7</a></p>&mdash; Isabella Velásquez (@ivelasq3) <a href="https://twitter.com/ivelasq3/status/1357136366568689664?ref_src=twsrc%5Etfw">February 4, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

