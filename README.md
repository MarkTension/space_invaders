# space_is_the_place

Space_is_the_place displays invaders in a radar image. It is my solution to the space invaders assignment.

To start: Open index.html , select files, and press the _find space invaders_ button

The code accepts as inputs:

- plain txt file of 2D radar image
- plain txt file with two 2D invader examples, with each invader separated by a whitespace

## The algorithm in short:

- creates a class instance of Crawler class for each invader shape
- each instance will crawl the radar image column-by-column, row--by-row. Crawling entails:
  1.  from current index, sample a matrix of size of invader
  2.  comparing the sample with the invader example, which yields a \*similarity ratio\*\*
  3.  storing the {similarity_ratio, size, dimensions, index} in an array called results
  4.  stepping to the next sample by increasing row or column
- similarity_ratio's exceeding boundary of 0.7\*\* are classified as invaders.
- similarity values are visualized in the resulting figures (with the help of p5.js and charts.js)

## Additional comments

The current heatmap approach allows classification certainty to express itself through the alpha/opacity of the invaders' color; higher alpha symbolizes higher certainty.
Because invaders look alike when enough noise is present, there might be some cases where one can be either. In such cases both crawler instances pick it up and the color is a combination of the two.
When changing the invader's identity, one probably needs to play with the similarity_ratio boundary to get classification right again.

<nowiki>\*</nowiki> the similarity_ratio is calculated by:
Getting residuals by subtracting example from sample-matrix.
Squaring the residuals, and reducing the matrix to its sum.
Dividing by the number of matrix elements to get a ratio for dissimilarity.
convert to ratio of similarity by: 1 - dissimilarity
