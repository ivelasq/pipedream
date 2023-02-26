---
title: "Blogdown for What"
image: thumbnail.png
image-alt: "Blogdown for What"
---

|          |                                                                                         |
|----------|-----------------------------------------------------------------------------------------|
| Abstract | A walkthrough on creating a website using the {blogdown} package.                       |
| Date     | August 23, 2018                                                                         |
| Time     | 6:30PM PT                                                                                  |
| Location | Seattle, WA                                                                             |
| Event    | [**R-Ladies Seattle Meetup**](https://www.meetup.com/rladies-seattle/events/252412318/) |

<center>
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vR2224Z5m2CgzZu7oiIABDPFsswi_uwDUWktp2gliM0gh_rRV2ziAJwFvcBjE2OvQ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="800" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</center>

Hello everybody. My name is Isabella Velasquez. I am very excited to talk to you today about the package blogdown. I’ve decided to call this presentation:
BLOGDOWN FOR WHAT?

A little about me: I’m Isabella. I’m a data analyst at the Bill & Melinda Gates Foundation along with R-Ladies Seattle organizer, Chaya. I started learning R in 2015 when attending graduate school at the University of Chicago. We were pretty much thrust into the R world and had to sink or swim, which is how I approach this talk. I try to be as straightforward as possible in my work and hopefully that is reflected in this presentation. This is meant to be a simple introduction on blogdown, why you should use it, and how to get set up.

Let’s start at the beginning. Why even have a website at all? It’s something that I think about a lot because sharing my thoughts and work is not something that comes naturally to me. Although I am not a prolific Twitter user or blogger, I do have accounts and try to keep up with the R world as best I can. Like I mentioned, I started learning R in graduate school. It’s been three years and I have vague recollections of my R journey. But with a website, I would have been able to clearly see how my analysis of data has evolved and improved. I could see how I moved from the data cleaning steps, summary statistics, visualization of different projects instead of just speculating when I go through all my various files. I also have all my projects in multiple places right now – on my laptop, on my work laptop, on my GitHub. If I wanted to find what I’ve done and share it with others, it would be quite a lift. A website can be the holder of all that information. And finally, there is nothing more valuable than sharing what you’ve done with others to get feedback. You get to see any gaps you missed, new ideas you may not have thought of, or how to continue your work and do more interesting, fun things. The R community is so vibrant and collaborative that you get to explore that with many many people around the world.

Enter [blogdown](https://bookdown.org/yihui/blogdown/). Blogdown is an R package that makes websites using R Markdown, which is a file format for documents, and Hugo, which is a static website generator. You can create the website entirely in R Studio. If you use GitHub, then you can upload your work to a repository and have version control readily available. And if you use GitHub, you can link your blogdown website with Netlify, which will easily publish your website.

So, blogdown for what? There are many options out there for creating websites. And that’s exactly the issue: there are many options out there for creating websites. There are many factors to consider, like whether your images will load quickly and how easy it is to create a new post. Blogdown considers all these factors and creates a fast, safe, easy to use website.

Because we’re talking about using R, which presumably means there will be data analysis involved. R Markdown is a format that easily details data analysis. It has code chunks so that you can see the actual code that you write and then it also displays the output, whether it be a table or image. But then it’s also easy to write in your commentary in regular text. Therefore, if you are using your website to show off your analysis and R skills, then R Markdown is a great format to do that in. However, the other very commonly used website creator Jekyll does not display R Markdown files very easily and unfortunately R Markdown isn’t great for creating websites on its own. Blogdown puts all the necessary steps in place to create a website that easily displays R Markdown pages.

The other great thing is that because blogdown also embeds Hugo, there are many themes available that are visually appealing even without customization. And if you do know how to customize websites, then the sky is the limit.

So how do you actually make a website with blogdown? The creator of the package, Yihui Xie, and his coauthors Amber Thomas and Alison Presmanes Hill luckily wrote a guide that walks through every step in detail. When creating my website, I just went through each page and followed the instructions. It’s that easy! But like I mentioned earlier, I want to give you the most straightforward introduction that I can.

Before we begin, make sure you already have RStudio and GitHub. Chaya recently gave a talk on GitHub and walked through creating a repository and linking to a project in R Studio. You can create a blogdown website without linking to GitHub, but in addition to all the benefits that GitHub provides, like version control, it will also allow you to host on Netlify easily later on.

Once you have a project in R Studio, you want to have blogdown installed!

And because the creators of blogdown have done such a good job making their package user friendly, once you have blogdown installed you actually don’t have to create a project with code although you can do whatever works for you. I just go into New Project then New Directory then create a Website using Blogdown. I like this add-in because if you use the same directory name as the project you cloned from R Studio, then all the blogdown folders will be created in that directory and then you can commit and push up to GitHub. This add-in also lets you install your theme if you don’t want the default one.

Once you have your new website project, you must run serve site in order to preview it within R Studio. Then you can start customizing within the file config.toml which is created when you create a site. Here, you can put things like your name, your Twitter handle. And once you are ready to create a new post, type new post in the console and run. It will populate an R Markdown file that you can fill in to your liking. And once all that is ready, you can commit and push up to GitHub!

Like I mentioned before, if you want an actual URL that people can go to, you can use Netlify for hosting. If you have pushed everything up to GitHub, you can connect netlify with your website repository and your webiste will update anytime you push up to GitHub. Netlify gives out a weird URL, which you can change but if you want to do even more things R, you can apply for an rbind.io URL. They have a request template where you list out your Netlify account and GitHub repo and desired URL and they got back to me in a day.

In terms of troubleshooting, I ran into an issue where my website wasn’t loading the way that it did in the R Studio preview window. I ran a quick Google search saying just that and saw that there was already a thread about it. I read through it, followed the instructions, and was able to fix it.

I mention that because there are so many resources for blogdown even in the few months it has been out. Beyond the official guide, Mara Averick works hard to compile resources and tutorials. StackOverflow has a blogdown tag. And many things are just a search away.

Thanks all for listening. I hope this presentation showed you why you should have a site, in particular a blogdown one, and how to create one. Hopefully I’ve also shown you that there’s a lot of help out there and they continue to make blogdown more user friendly all the time. And finally [here](https://ivelasq.rbind.io/) is my blogdown site...with all the neat Hugo functionalities!

