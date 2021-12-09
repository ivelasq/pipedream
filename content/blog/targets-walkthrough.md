---
title: Using the {targets} package for creating a reproducible pipeline without repeating yourself
date: '2021-12-09'
tags: ['targets', 'reproducibility']
---

This talk is based on [Will Landau's Reproducible Computation at Scale With targets](https://www.youtube.com/watch?v=GRqKJBaC5g4
) talk at R/Pharma 2020.

I presented this talk at [R-Ladies Seattle](https://rladiesseattle.org/) on December 9, 2021.

---

You may have seen the 1993 movie Groundhog Day. If you haven’t, I will try to avoid as many spoilers as I can, but essentially the main character experiences the same day over and over. He tries different things to make the day feel different, but it’s like he’s in an endless loop of the same events.

You may have seen also a data analysis workflow that looks something like this. You import your data, tidy it, go through a cycle of transformation, visualization, and modeling, then you communicate the results. Simple enough, right?

![Import, tidy, visualize, transform, model, communicate](https://ivelasq.rbind.io/images/targets-files/1.png)

However, things aren’t always as easy as they seem. Sometimes we run into issues with our pipeline and we have to go back and correct things. And hopefully we remember all the things that we need to change. If we don’t, we might not be able to get accurate results, or reproduce results in the future.

![Import, tidy, visualize, transform, model, communicate but having to redo several components](https://ivelasq.rbind.io/images/targets-files/2.png)

Even if we do remember, one small change means that we have to rerun our entire workflow from scratch. Everything that depends on the new data or code also has to be updated. This can be really time consuming if our pipeline has really long runtimes. If the computation already takes hours to complete, then having to redo it all will set us back significantly and it ends up feeling like Groundhog Day.

![A groundhog next to a series of code sourcing data from other files](https://ivelasq.rbind.io/images/targets-files/3.png)

When you find yourself chugging coffee, waiting for everything to run — again! — consider instead using a pipeline tool. Pipeline tools break the cycle of launching code, waiting for it to run, discovering an issue, and restarting from scratch.

One type of a pipeline tool is called a Make file. A make file is a file you make (hence the name), with a list of rules that tell the system the commands you want executed. One nifty thing about make files is that they only update those files containing changes - they don’t rerun things that don’t need to be re-run. Restarting a pipeline can go a lot faster. And unless directed otherwise, make files will stop when it encounters an error during the construction process. This makes it easy to spot any problems.

![An example workflow from the targets package](https://ivelasq.rbind.io/images/targets-files/4.png)

[Targets](https://docs.ropensci.org/targets/) is a make-like pipeline tool specifically designed for R by Will Landau and on ROpenSci. It has a clean, modular, function-oriented programming style. It has strong guardrails because by design, it is not meant to be flexible - there’s only one right way to use targets. And because it was built for R users, it is easy to use within our existing R toolkit.

* Github: https://github.com/ropensci/targets/
* Manual: https://books.ropensci.org/targets/

## Example

Let’s walk through an example of using targets for a clinical trial simulator. This designs a randomized placebo-controlled phase 2 clinical trial of a potential new treatment of COVID-19 to understand the operating characteristics of a 200-patient trial under different effect size scenarios.

## Set up

We need two things:

1. Functions
2. _target.R file

1\. Functions

For the simulator, we have functions that run the pipeline that we want. The functions should have no side effects, with an R object like a dataset, a fitted model, or a table or figure as the output. In terms of size, you want targets to be big enough that you're progressing along your workflow but not too big that some targets can be skipped even if others need to run.

![Clinical trial experiment with corresponding functions](https://ivelasq.rbind.io/images/targets-files/5.png)

2\. _targets.R File

Every targets workflow needs a target script file to formally define the targets in the pipeline. It says what will be run, how, and when.

Here are the requirements for a target file:

![Example target file with annotations for the requirements](https://ivelasq.rbind.io/images/targets-files/6.png)

In terms of file structure, we can use one based on our usual project conventions. Targets is structure-agnostic but we still want to make sure it's a well-organized project.

![Example file structure](https://ivelasq.rbind.io/images/targets-files/7.png)

## See it in action

Check out Will Landau's R/Pharma 2020 example in this [RStudio Cloud project](https://rstudio.cloud/project/3342415). The original repo is here: https://github.com/wlandau/rpharma2020.

Load the library:

```
library(targets)
```

Then check out the dependency graph to see how things slow into each other:

```
tar_visnetwork()
```

![Example dependency chart](https://ivelasq.rbind.io/images/targets-files/7.png)


Run the pipeline with `tar_make()`:

```
> tar_make()
• start target mean_treatment
• built target mean_treatment
• start target sim
• built target sim
• start branch patients_19070d77
• built branch patients_19070d77
• start branch patients_443fddf5
• built branch patients_443fddf5
• start branch patients_6b655e88
• built branch patients_6b655e88
• start branch patients_8cd9d86a
• built branch patients_8cd9d86a
• start branch patients_0de10de6
• built branch patients_0de10de6
• start branch patients_e44f9687
• built branch patients_e44f9687
• start branch patients_b23bc50c
• built branch patients_b23bc50c
• start branch patients_75b3e706
• built branch patients_75b3e706
• start branch patients_6b204f5c
• built branch patients_6b204f5c
• start branch patients_363b5ea6
• built branch patients_363b5ea6
• start branch patients_26c555b6
• built branch patients_26c555b6
• start branch patients_50c68e38
• built branch patients_50c68e38
• start branch patients_b9c54de0
• built branch patients_b9c54de0
• start branch patients_6e954a65
• built branch patients_6e954a65
• start branch patients_76c73999
• built branch patients_76c73999
• start branch patients_9704cf83
• built branch patients_9704cf83
• start branch patients_42e85aaa
• built branch patients_42e85aaa
• start branch patients_274cdb6c
• built branch patients_274cdb6c
• start branch patients_93c86a1e
• built branch patients_93c86a1e
• start branch patients_11601fd2
• built branch patients_11601fd2
• start branch patients_bbb91149
• built branch patients_bbb91149
• start branch patients_11d590a9
• built branch patients_11d590a9
• start branch patients_2dec851d
• built branch patients_2dec851d
• start branch patients_e577dc66
• built branch patients_e577dc66
• start branch patients_cb0dc572
• built branch patients_cb0dc572
• start branch patients_1089f920
• built branch patients_1089f920
• start branch patients_c6575c40
• built branch patients_c6575c40
• start branch patients_341af214
• built branch patients_341af214
• start branch patients_2d01aa51
• built branch patients_2d01aa51
• start branch patients_f77a64ef
• built branch patients_f77a64ef
• built pattern patients
• start branch models_8730d000
• built branch models_8730d000
• start branch models_b346e48d
• built branch models_b346e48d
• start branch models_cf09cbdb
• built branch models_cf09cbdb
• start branch models_9949c199
• built branch models_9949c199
• start branch models_cb06b842
• built branch models_cb06b842
• start branch models_7ef25236
• built branch models_7ef25236
• start branch models_b34dcb0b
• built branch models_b34dcb0b
• start branch models_53b15e5b
• built branch models_53b15e5b
• start branch models_53de1d64
• built branch models_53de1d64
• start branch models_f68cb728
• built branch models_f68cb728
• start branch models_249ac88b
• built branch models_249ac88b
• start branch models_bcca4c8c
• built branch models_bcca4c8c
• start branch models_42fc37a9
• built branch models_42fc37a9
• start branch models_b394080e
• built branch models_b394080e
• start branch models_f0d4b4ca
• built branch models_f0d4b4ca
• start branch models_7e338569
• built branch models_7e338569
• start branch models_004098a4
• built branch models_004098a4
• start branch models_8e1f2a42
• built branch models_8e1f2a42
• start branch models_4aa916ba
• built branch models_4aa916ba
• start branch models_0a0d3f76
• built branch models_0a0d3f76
• start branch models_9fcf1eb9
• built branch models_9fcf1eb9
• start branch models_8199a2bd
• built branch models_8199a2bd
• start branch models_bd31428e
• built branch models_bd31428e
• start branch models_7f24e669
• built branch models_7f24e669
• start branch models_6ee746ec
• built branch models_6ee746ec
• start branch models_6f3410d9
• built branch models_6f3410d9
• start branch models_62c431c5
• built branch models_62c431c5
• start branch models_a59d65d4
• built branch models_a59d65d4
• start branch models_ddba4a82
• built branch models_ddba4a82
• start branch models_bf261768
• built branch models_bf261768
• built pattern models
• start target summaries
• built target summaries
• start target results
• built target results
• end pipeline
```

See the results with `tar_read()`:

```
> tar_read(results)
# A tibble: 3 × 6
  prob_success mean_treatment mean_control patients_per_arm
         <dbl>          <dbl>        <dbl>            <dbl>
1          1                5           20              100
2          0.6             15           20              100
3          0               20           20              100
# … with 2 more variables: median <dbl>, max_psrf <dbl>
```

Go to _targets.R and change `tar_target(mean_treatment, c(5, 15, 20), deployment = "worker")` to `tar_target(mean_treatment, c(10, 15, 20), deployment = "worker").

Run `tar_visnetwork()` again and see that `mean_treatment` and all of its downstream dependencies are outdated.

```
tar_visnetwork()
```

![Example dependency chart with outdated notes](https://ivelasq.rbind.io/images/targets-files9.png)

Run the pipeline again with `tar_make()`. Notice that some branches are skipped because they do not need to be rerun.

```
> tar_make()
✓ skip target mean_treatment
✓ skip target sim
✓ skip branch patients_19070d77
✓ skip branch patients_443fddf5
✓ skip branch patients_6b655e88
✓ skip branch patients_8cd9d86a
✓ skip branch patients_0de10de6
✓ skip branch patients_e44f9687
✓ skip branch patients_b23bc50c
✓ skip branch patients_75b3e706
✓ skip branch patients_6b204f5c
✓ skip branch patients_363b5ea6
✓ skip branch patients_26c555b6
✓ skip branch patients_50c68e38
✓ skip branch patients_b9c54de0
✓ skip branch patients_6e954a65
✓ skip branch patients_76c73999
✓ skip branch patients_9704cf83
✓ skip branch patients_42e85aaa
✓ skip branch patients_274cdb6c
✓ skip branch patients_93c86a1e
✓ skip branch patients_11601fd2
✓ skip branch patients_bbb91149
✓ skip branch patients_11d590a9
✓ skip branch patients_2dec851d
✓ skip branch patients_e577dc66
✓ skip branch patients_cb0dc572
✓ skip branch patients_1089f920
✓ skip branch patients_c6575c40
✓ skip branch patients_341af214
✓ skip branch patients_2d01aa51
✓ skip branch patients_f77a64ef
✓ skip pattern patients
✓ skip branch models_8730d000
✓ skip branch models_b346e48d
✓ skip branch models_cf09cbdb
✓ skip branch models_9949c199
✓ skip branch models_cb06b842
✓ skip branch models_7ef25236
✓ skip branch models_b34dcb0b
✓ skip branch models_53b15e5b
✓ skip branch models_53de1d64
✓ skip branch models_f68cb728
✓ skip branch models_249ac88b
✓ skip branch models_bcca4c8c
✓ skip branch models_42fc37a9
✓ skip branch models_b394080e
✓ skip branch models_f0d4b4ca
✓ skip branch models_7e338569
✓ skip branch models_004098a4
✓ skip branch models_8e1f2a42
✓ skip branch models_4aa916ba
✓ skip branch models_0a0d3f76
✓ skip branch models_9fcf1eb9
✓ skip branch models_8199a2bd
✓ skip branch models_bd31428e
✓ skip branch models_7f24e669
✓ skip branch models_6ee746ec
✓ skip branch models_6f3410d9
✓ skip branch models_62c431c5
✓ skip branch models_a59d65d4
✓ skip branch models_ddba4a82
✓ skip branch models_bf261768
✓ skip pattern models
✓ skip target summaries
✓ skip target results
✓ skip pipeline
```

See the updated results with `tar_read()`:

```
> tar_read(results)
# A tibble: 3 × 6
  prob_success mean_treatment mean_control patients_per_arm
         <dbl>          <dbl>        <dbl>            <dbl>
1          1               10           20              100
2          0.6             15           20              100
3          0               20           20              100
```

If you want to check out an error, delete the `_targets.R` file, uninstall the tidyverse package, and try to rerun `tar_make`. Targets will quickly stop the pipeline where it detects the error.

```
> tar_make()
• start target mean_treatment
x error target mean_treatment
• end pipeline
Error : could not find packages tidyverse in library paths 
```


Avoid data analysis groundhog day with targets!

## More on targets

Check out more in the [targets R Package User Manual](https://books.ropensci.org/targets/).

* Helper functions
* R Markdown documents
* Rules for the workflow
* Targets + Git/Github and renv
* Performance monitoring
* Dynamic branching
* and more!

## Resources

* [ROpenSci targets docs](https://docs.ropensci.org/targets/)
* [The targets R Package User Manual](https://books.ropensci.org/targets/)
* Will Landau, [Reproducible Computation at Scale With targets](https://www.youtube.com/watch?v=Gqn7Xn4d5NI&t=6022s) (1 hour walkthrough)
* [Stantargets and Target Markdown for Bayesian model validation](https://www.youtube.com/watch?v=odcBA4ETLn8)


