library(tidyverse)
library(tabulizer)
library(janitor)

# race data

out1 <-
  extract_tables("http://studentaccounting.mpls.k12.mn.us/uploads/racial_ethnic_school_gradefall2017.pdf")

race_df <- NULL

for (i in 1:15){
  tmp <- matrix(unlist(out1[i]), ncol = 16, byrow = F) %>% 
    as_data_frame() %>% 
    set_names(c("school_group", "school_name", "grade", "na_num", "na_pct", "aa_num", "aa_pct", "as_num", "as_pct", "hi_num", "hi_pct", "wh_num", "wh_pct", "pi_num", "pi_pct", "tot")) %>% 
    slice(-1:-2) # row names were embedded in dataset
  race_df <- bind_rows(race_df, tmp)
}

race_filter <-
  race_df %>% 
  filter(str_detect(school_name, "Total")) %>% 
  mutate(school_name = str_replace(school_name, "Total", "")) %>% 
  mutate_if(is.character, trimws)

# frpl data

out2 <-
  extract_tables("http://studentaccounting.mpls.k12.mn.us/uploads/free_reduced_meal_fall_2017.pdf")

frpl_df <- NULL

for (i in 1:2){
  tmp <- matrix(unlist(out2[i]), ncol = 7, byrow = F) %>% 
    as_data_frame() %>% 
    set_names(c("school_grades", "school_name", "total_students", "frpl_pct", "free_num", "reduce_num", "not_eligible_num")) %>% 
    slice(-1) # row names were embedded in dataset
  frpl_df <- bind_rows(frpl_df, tmp)
  
}

frpl_filter <-
  frpl_df %>% 
  filter(school_name != "") %>%
  mutate_at(3:7, as.numeric) %>%
  adorn_totals() %>% 
  mutate(frpl_pct = (free_num + reduce_num)/total_students) 

# merge data

merged_df <-
  left_join(race_filter, frpl_filter, by = "school_name") %>% 
  select(-school_group, -grade, - school_grades) # empty/unnecessary columns 

# tidy data

tidy_df <-
  merged_df %>%
  gather(category, value, -school_name)

# write_csv(tidy_df, "tidy_df.csv")

tidy_df %>%
  filter(school_name == "Grand",
         str_detect(category, "pct")) %>% 
  ggplot(aes(x = category, y = value)) +
  geom_bar(stat = "identity")
