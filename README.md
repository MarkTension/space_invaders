# space_is_the_place

Space_is_the_place displays invaders in a radar image.

To start: Open index.html , select files, and press *find space invaders* button

The code accepts as inputs:
- plain txt file of 2D radar image
- plain txt file of 2D invader examples, with each invader separated by a whitespace

The algorithm in short:
- creates a class instance of Crawler class for each invader shape
- each instance will crawl the radar image column-bycolumn, row--by-row. Crawling entails: 
  1. from current index, sample a matrix of size of invader 
  2. comparing the sample with the invader example, which yields a *similarity ratio**
  3. storing the {similarity_ratio, size, dimensions, index} in an array called results
  4. stepping to the next sample by increasing row or column
- similarity_ratio's exceeding boundary of 0.7** are classified as invaders.
- similarity values are visualized in the resulting figures (with the help of p5.js and charts.js)


<nowiki>*</nowiki> the similarity_ratio is calculated by:
Getting residuals by subtracting example from sample-matrix. 
Squaring the residuals, and reducing the matrix to its sum. 
Dividing by the number of matrix elements to get a ratio for dissimilarity.
convert to ratio of similarity by: 1 - dissimilarity
