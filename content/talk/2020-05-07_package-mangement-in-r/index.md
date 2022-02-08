---
author: Isabella Velásquez
categories:
  - R
  - Package
date: "2020-05-07T14:00:00-06:00"
draft: false
excerpt: Reproducible data science encompasses a broad range of practices including, but not limited to, version control and literate programming. One practice that is often overlooked is proper management of packages. Code that works with software or package version you have installed may break when run with different software or package version. In this webinar, we will discuss R package management solutions for two scenarios. Isabella will show how to maintain installed packages when upgrading to a new version of R, using the recent release of R 4.0 as an example. Mike will demonstrate how the renv package can be used to maintain packages within individual data science projects.
event: Seattle useR Group
event_url: https://www.meetup.com/Seattle-useR/events/270353523/
layout: single
location: Seattle, WA
title: Package Management for Reproducible Data Science in R
links:
- icon: github
  icon_pack: fab
  name: "Github Repository"
  url: https://github.com/garciamikep/useR-webinar
---

<script src="{{< blogdown/postref >}}index_files/fitvids/fitvids.min.js"></script>
<div class="shareagain" style="min-width:300px;margin:1em auto;">
<iframe src="https://garciamikep.github.io/useR-webinar/useR-slides.html#1" width="1600" height="900" style="border:2px solid currentColor;" loading="lazy" allowfullscreen></iframe>
<script>fitvids('.shareagain', {players: 'iframe'});</script>
</div>

**Upgrading R in the time of coronavirus**

Hi everybody! My name is Isabella Velasquez, I am a data analyst at the Bill & Melinda Gates Foundation.

I am really excited to talk to you today about updating R in the time of coronavirus!

R 4.0.0, with the release name Arbor Day, was released in late April. It moved R from a 3.x version to 4.0, which is called a major upgrade. This is pretty exciting - as with all major upgrades of R, there’s a lot of new features in 4.0. There’s a function that will convert your lists to a data frame, sort your non-atomic objects, there are new color palettes, etc.
…
And probably what most were excited about was that the default for stringsAsFactors is now FALSE, which is great for those of us who suffered a lot when the default was TRUE, and it’s probably the most talked about detail about this upgrade.

I invite you to think now about this new version of R, and ask: If I were to request that you upgrade R from your current version to 4.0 right now, how would you feel? You can write how worried you’d be and something you may be worried about in the chat now.

For some, upgrading R immediately sounds great. It means you have the newest stuff! For others, there is a lot of hesitation. But regardless of how you feel, when you upgrade R, you will have to reinstall your packages.

On most single-user systems (Mac, Windows, and Linux), when you upgrade to a new major version of R (like 3.3.0 to 4.0.0), R will no longer find your previously installed packages because now there is a new package library. When this happens, you may see that when R code calls the library() function, it throws an error and reports that the package is missing.

There are many options to deal with reinstalling packages in a new version of R and we will walk through some of them. I want to emphasize that I’ll be focusing on single-user systems like Mac, Windows, and Linux - I know there are other ways that people use R, but that will be out of scope for my talk.

The first option we’ll talk about is upgrading R, which will create a new package library for 4.0.0, and then installing packages as you need them for your code. Some people prefer this option because it feels like you have a clean start, since your package library will be completely clear. You may know how refreshing this is if you’ve downloaded a bunch of packages to try out and then never ended up using them. If you use the RStudio IDE, it will let you know if you have a package that is missing so that you can install it before you run your script. The downside of this option is that you won’t be up and ready to go with your scripts because the packages will first need to be installed, which can be a hassle. So, this leads into another option, where you can….

Upgrade R, and then reinstall all your packages at once. This will enable you to get up and going with your scripts shortly after upgrading R. There are many ways of doing this. I’ll walk through an example script that I posted on Twitter that was created by my brother. This is something you’d run after you’ve upgraded to R 4.0.0.

First, remember that all your packages need to be reinstalled because there is a new package library. So, you reinstall `tidyverse` and `fs` and then call them.
Then, you find which versions of R you have installed on your machine. The directories on Windows, Linux, and Mac slightly vary, that is why you have different options depending on your operating system.

Then, the script determines which of your versions is the newest, current version of R and which was the second newest version of R and calls them new\_r and old\_r.
Then, it finds the library paths, or .libPaths(), for new\_r and old\_r and extracts the list of packages that are available in old\_r.

Then, it creates a function called install\_all that installs packages.
Finally, it installs all the packages in the list of packages, purring all the way

Again, that is just one of the many options available to you. Here is another script that garnered a lot of attention on Twitter. There are also functions in formal packages that will reinstall your packages for you.

There are a few things to note. You have to make sure that whatever script or function works for you - for example, {installr} only works on Windows. If you use Homebrew, the default Homebrew behavior is to delete the old R .libPaths() folder when upgrading, so then there won’t be a 3.x folder from which to build a list of pkgs to install in 4.0.

Also, some of these options will not redownload your Bioconductor or Github dev packages. You may have to find other ways of getting these packages in R 4.0.0.

Finally, when you reinstall packages, they will download the latest version of the package. If your scripts rely on an older version of the package, your code may no longer run. So, if having old packages is important to you, you can…

Upgrade R but use your old packages. So full disclosure, I have not done this before. As far as I can tell, it’s not very encouraged. The idea behind this option is to upgrade R, keep the old library folders, change .libPaths() to the old R version library, and try to call the library() function from there. Another way is to try to copy the folders from the old package library to the new library and that is not a good plan. If the packages were built on 3.x, then there’s no guarantee they’d work in 4.x. This is because R and packages have system dependencies, and some of the packages may break if installed on R 4.0.0 and maintainers haven’t upgraded their code yet.

So, if you’ve ever tried to download RJava even in the best of times, you may know what dependency hell is - so try to avoid that by not creating too much chaos with your packages.

So, we’ve talked about upgrading R and installing your packages one at a time, upgrading R and installing all your packages at once, and upgrading R and keeping your old packages. But, if you want to avoid all of this, you can always…

Not upgrade R! This is very common, especially as people wait for kinks to be sorted out. For example, there are a lot of issues right now with R 4.0.0 users not being able to upload Shiny apps to shinyapps.io. If your organization is dependent on this app, it might be better to wait until a more stable time to try out the new major version.

Still, even if you’re not ready to jump into R 4.0.0 yet, you can do a few things. Users have provided ways to test out your packages and scripts before you fully upgrade, and there are more formal ways of switching between R versions available as well.

So, how do you decide what to do? It very much depends on you! For example, if you worry about being able to refind packages that aren’t on CRAN, you may consider porting it over to your new R version somehow. If you live in a place with very slow internet, it might make sense to not have to reinstall all your packages all at once. If your code is very organized, maybe you won’t have issues knowing which packages to install or not install. Maybe you want to be able to hit the ground running with all the packages you’ve used in the past, so may as well install them all now.

I want to take a quick poll - how many of you have already upgraded to 4.0.0?

Fun fact: as we were developing this talk, we ran into an issue where one of us (Mike) had upgraded to R 4.0.0, and another one of us (me) had not, and so I wasn’t able to knit our slides. So I provide this as an example of how knowing your team and workflow is crucial to decide what to do! When you weigh these different considerations, you can figure out the path forward for R and your packages. And, I’ve now updated R, and am installing my packages one by one.

So, all of these different options assume that you are not using virtual environments, which create isolated environments for projects and provide another option for package management. To discuss this, I will now turn it over to Mike!
