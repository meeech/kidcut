# KIDCUT

## ABOUT

Tool for making super-cuts of movies. Main goal was easy way to generate shorter version of movies that I can watch with my kid. Allows mapping out a light version using timecodes, so I can remove a fair bit of on-screen deaths and violence, but still keep the story intact. 

Also, Greedo shot first.

See `cuts` directory for example.

## REQUIRES

ffmpeg

## INSTALL

* clone the repo
* npm install

## USAGE

`kidcut` for help
 
`kidcut -i path/to/input/file.mp4 -o path/to/output_dir/ -c path/to/cut/file`

`kidcut -i source/StarWars_A_New_Hope.mov -c cuts/starwars-ep4.js create`

-o is optional - if you don't provide output directory, will use same dir as source

## CUT FILE FORMAT

Simple js file. [TKTKTK]

## TODO

    * add support for supercut file with defined source files and codes to make one big supercut. basic idea is to make something like lightsaber-battle cut across all the films to one file 
    * put on npm
    * clean up pieces after merge
    * list: if no cut provided, allow picking from list
    * expose more output options
    * can run more cutters at once to speed up process?
    