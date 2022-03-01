---
title: "You CRAN do it"
author: "Isabella Velásquez"
date: "2020-02-25"
categories: ["cran", "package-development"]
description: Recommendations for when you want to submit a package to CRAN.
image: "thumbnail.png"
---

![J. Howard Miller, We Can Do It!](thumbnail-wide.jpg)

As the @[WeAreRLadies](https://twitter.com/WeAreRLadies) curator, I [asked the Twitterverse](https://twitter.com/WeAreRLadies/status/1227937968117043200) for advice when submitting a package to the Comprehensive R Archive Network (CRAN) for the first time. Many people replied and offer their tips, experience, and well wishes. I have summarized everybody's replies below. THANK YOU all for participating!

Here's what to expect when succeeding to get your package on CRAN!

<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As someone who hopes to submit their first package 📦to CRAN this year… what should I know? 😳</p>&mdash; We are R-Ladies (@WeAreRLadies) <a href="https://twitter.com/WeAreRLadies/status/1227937968117043200?ref_src=twsrc%5Etfw">February 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

## Read the official CRAN documentation

... which is [Writing R Extensions](https://cran.r-project.org/doc/manuals/r-release/R-exts.html)! "Necessary and sufficient," according to Avraham Adler.

## You can get by with a little help from your friends

{usethis}, {devtools}, and {roxygen2}, although not necessary, are useful tools for creating CRAN-ready packages.

## Documentation is key

* Have tests and coverage via {covr}, and make sure they run without issues on all platforms
* CRAN will ask that you add examples to your package, wrapped in `\dontrun{}` and `\donttest{}`.
* Ask others read your stuff and provide feedback!

## Let reviewers know why this should be on CRAN

A quick note letting the reviewers know why your package should be on CRAN goes a long way. 

<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Reviewer asking “why do we need this on CRAN?” isn’t a rejection, just respond politely with a reason. <br><br>Also, if <a href="https://t.co/9Mgm9C20E6">https://t.co/9Mgm9C20E6</a> can make it to CRAN, your package belongs there too!</p>&mdash; Jay Qi (@jayyqi) <a href="https://twitter.com/jayyqi/status/1228049523806617601?ref_src=twsrc%5Etfw">February 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

## Be patient

The people at CRAN are busy! It might take a while for them to reply and accept your package. If you want to track the progress of your package, you can take a look at the [CRAN Incoming Dashboard](https://lockedata.github.io/cransays/articles/dashboard.html).

## Emails will be terse

This is particularly difficult for me to hear, as someone who provides! ample! exclamation marks! in emails! in order to sound cheery and polite, but responses can be short and to-the-point. Breathe, and address everything mentioned. When you do reply, respond to the CRAN list.

## Persist

The reviewers will let you know what you need to do for approval. Go through their list carefully and try again!

<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Don’t get discouraged if you don’t succeed on your first try. Everyone (including me, my team, and R core) gets rejected from time to time. It sucks, but don’t give up — just make the requested changes and resubmit.</p>&mdash; Hadley Wickham (@hadleywickham) <a href="https://twitter.com/hadleywickham/status/1228043230601777152?ref_src=twsrc%5Etfw">February 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

Many thanks to the R Community for their words of advice and encouragement ❤

## Guides

* [Writing R Extensions](https://cran.r-project.org/doc/manuals/r-release/R-exts.html) (Official CRAN Documentation)
* Hadley Wickham and Jenny Bryan's [R Packages](https://r-pkgs.org/)
* Julia Silge's [How I Learned to Stop Worrying and Love R CMD Check](https://juliasilge.com/blog/how-i-stopped/)
* Maëlle Salmon's [Code Examples in R Package Manuals](https://blog.r-hub.io/2020/01/27/examples/)
* R-hub's [Prepare a CRAN submission](https://r-hub.github.io/rhub/articles/rhub.html#prepare-a-cran-submission)
* R-hub's [CRAN submission preparation with rhub](https://vimeo.com/329059890)
* Karl Broman's [Getting Your R Package on CRAN](https://kbroman.org/pkg_primer/pages/cran.html)
* Colin Fay's [Preparing your package for a CRAN submission](https://github.com/ThinkR-open/prepare-for-cran)
* Jp Marín Díaz's [How to publish a package to CRAN](https://jpmarindiaz.com/2020-01-08-how-to-publish-a-package-to-cran/) and [From 0 to CRAN in 1 day](https://jpmarindiaz.com/2020-02-13-from-0-to-cran-in-1-day/)
* Jim Hester's [Submitting vroom to CRAN, LIVE!](https://www.jimhester.com/post/2019-05-01-submit-vroom/)
* Ryo Nakagawara's [CRAN Trial(s) and Error(s) and Future Releases](https://ryo-n7.github.io/2019-09-06-tvthemes-CRAN-announcement/#cran-trials-and-errors-and-future-releases)

<center>
*Liked this article? I’d love for you to retweet!*

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">📢 New blogpost 📢 You CRAN Do It: What CRAN First-Timers Should Know 💪a summary of a thread from <a href="https://twitter.com/WeAreRLadies?ref_src=twsrc%5Etfw">@WeAreRLadies</a>. Thank you for all your advice and encouragement! <a href="https://t.co/BimejGvqdr">https://t.co/BimejGvqdr</a> <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a> <a href="https://t.co/0Ygk7qHc76">pic.twitter.com/0Ygk7qHc76</a></p>&mdash; Isabella Velásquez (@ivelasq3) <a href="https://twitter.com/ivelasq3/status/1233031919551401984?ref_src=twsrc%5Etfw">February 27, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

