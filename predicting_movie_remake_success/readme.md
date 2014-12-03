## Predicting Box Office Success of Movie Remakes

Currently there are [over 15 original films](http://www.imdb.com/list/ls052091214/?start=1&view=detail&sort=release_date_us:desc&defaults=1&scb=0.48789280536584556) slated to be remade and released in the box office next year.  The current list for appoved cinema remakes over the next 5 years is 108 titles long. Despite the fact that remade movies appear to frequently underperform at the box office, movie studios are showing no sign of slowing down their frequency of producing remade films. Why would this be?  

Producing a film, like any other business, requires up-front capital and in an ideal scenario the investors want to make healthy returns on their investments with as little risk as possible. Movie remakes are simply considered less risky in the industry. The original movies they are based off of generally had been box office successes in their first incarnations, and already carry built-in public familiarity in their titles. Hence the assumption is that the original financial success of the original film can ultmiately act as a proxy for the relative success of the remake. But how accurate is this assumption, in practice?  

I decided to test the hypothesis by building a model that would attempt to use the box office success of an original film to accurately predict the box office success of its remake.  

## Obtaining the data

The first step in building my predictive model was to gather all the historical data I could on movie remakes.  As it turns out, Wikipedia has [an entry](http://en.wikipedia.org/wiki/List_of_film_remakes) dedicated entirely to listing and linking to (presumably) every movie remake produced, along with links to the original films.  I used the Beautiful Soup python library to scrape the contents of each individual movie url, extracting the budget and box office gross for each film. Since the time range of this list spanned nearly 100 years, and it was not uncommon for films to be remade decades after the release of the original, the box office gross numbers listed in Wikipedia in the majority of cases could not be fairly compared to each other. To establish a standard means of comparison for the gross earnings of every film regardless of release date, I adjusted all scraped box office gross numbers for inflation, converting all earnings to be recorded in terms of their equivalent value in US dollars in 2014. 

In addition to box office gross, I wanted to investigate the effect that other features might have in determining the success of a movie remake. To get the supplemental metadata that I needed, I scraped each film's IMBD page, pulling release date and the IMDB rating. 

All my scraped and cleaned data was ultimately stored in a Pandas dataframe, pairing the original and remake data for each remade film together in a single row in preparation for a regression analysis.


## Regression Analysis & Insights


<b>Exploring aggregate gross of originals vs. aggregate gross of remakes:</b>

![alt text](https://squip.github.io/assets/movie_remakes/luther_gross_comparison.png "aggregate gross of originals vs. aggregate gross of remakes")

* In aggregate, film remakes have grossed ~ $30 billion more than the aggregate of their original counterparts.
* All film remakes and originals that had retrievable data on box office gross revenue are represented in this plot.
* This suggests that there is an opportunity to make money if you’re in the business of creating a film remake.
* The question is, how can you go about producing one while minimizing your risk?


<b>Exploring remake gross as a function of original gross:</b>

![alt text](https://squip.github.io/assets/movie_remakes/luther_original_gross_vs_remake_gross.png "Remake Gross vs. Original Gross")

* This plot helps us investigate whether any meaningful relationship exists solely between the gross box office success of an original film and the gross box office success of a remake.
* The results indicate that the gross of the original is not a strong enough standalone predictor for the remake gross.
* There are many cases where remakes either significantly outperformed or underperformed the original with no distinct or meaningful pattern. 


<b>Exploring remake gross as a function of the remake's production budget:</b>

With no consistent relationship found between the box office success of remakes and originals, I decided to look into other possible factors of a remake's success, namely the budget of the remake.

![alt text](https://squip.github.io/assets/movie_remakes/luther_remake_gross_vs_remkae_budget.png "Remake Budget vs. Remake Gross")

* Looking at the same set of movies, we can observe a much stronger positive relationship between the remake’s box office gross and the remake’s budget.
* These observations suggest that while the financial success of an original film may not be particularly useful in predicting the financial success of it’s remake, the production budget of the remake could be a useful feature in our prediction model.


<b>Regression round 1: Predicting remake gross as a function of the original gross:</b>

We learned so far that original gross alone was not enough to accurately predict the remake gross, however, since we did not yet know which features would contribute to the improvement of our prediction model, I decided to build a regression model one feature at a time and plot the prediction accuracy.

![alt text](https://squip.github.io/assets/movie_remakes/luther_regression_predictions_1.png "Predicting Remake Gross Using Original Gross")

* We first fit our linear regression model using only 1 feature: predicting a film remake’s gross  box office revenue as a function of the original gross revenue. 
* Our prediction accuracy is visibly weak.
* R-squared: 0.185


<b>Regression round 2: Predicting remake gross as a function of the original gross + more features:</b>
Next we expanded our prediction model by adding 2 new features. Our model now predicts based on:

* Original gross
* Original IMDB rating
* Number of years between the release dates of the original and the remake.

![alt text](https://squip.github.io/assets/movie_remakes/luther_regression_predictions_2.png "Predicting Remake Gross Using Original Gross, IMDB rating, and release date delta")

* Our predictions are beginning to improve.
* R-squared: 0.201


<b>Regression round 3: Predicting remake gross as a function of the original gross + even more features:</b>

As observed from our earlier exploration, using the budget of the remake as an additional feature in our regression model gives us our strongest set of predictions.

![alt text](https://squip.github.io/assets/movie_remakes/luther_regression_predictions_2.png "Predicting Remake Gross Using Original Gross, IMDB rating, release date delta, and remake budget")

* Our regression model is significantly improved with the addition of budget.
* R-squared: 0.771


<b>Impact on Prediction Confidence</b>
Each additional feature to our model creates incremental improvements to our predictions, and reduces our overall uncertainty.

![alt text](https://squip.github.io/assets/movie_remakes/luther_risk_reduction.png "Final set of features reduces prediction uncertainty to (+/-) $130 M.")


## Conclusion

Ultimately our improved model is still very risky, with prediction uncertainty at $130 million, but we have been able to reduce the risk significantly by ~$80 million with 95% confidence. The current model would not be practical for managing box-office risk, however our exploratory analysis provides some useful insight into how certain features do factor into the success of a movie remake.  To improve this analysis moving forward, I would like to explore some additional features, for instance how genre may factor into what kinds of remakes are more likely to be successul.