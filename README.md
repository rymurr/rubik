rubik
=====

rubik cube solver

TODO
----

1. next steps should be able to be done w/o full webpage
1. transform screenshots to grid to represent rubiks cube
1. use CV stuff to turn screenshots into properly scaled rubiks cube face
1. errors to announce cant find rubiks cube face
1. break up grid and find color of each square
1. lots of feedback for cant find square/color etc.
1. lots of tests with different types of stored images
1. convert pictures to blocks of color and check if its ok
1. solve cube and display steps to achieve results
1. buttons to step through results with visual highlights
1. update the colored blocks to keep up with steps taken to solve

NOTES
-----

Currently I am able to take photos using HTML5 and display each 'side' of the 
cube. Next step is to find the cube in an image and extract the current state 
of the rubiks cube. I am having difficulty with that as there aren't many good
algorithms available in JavaScript. I am implementing my own Hough Transform in 
the hopes that that can be used to find the rectangles of the rubiks cube. 

I am bored and will revisit later...
