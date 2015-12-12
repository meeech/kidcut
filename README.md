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

`kidcut -i source/StarWars_A_New_Hope.mov create` will use the source file you specify, and present you with a list of cuts to choose from

`kidcut -i path/to/input/file.mp4 -c path/to/cut/file create` will use the source file you specify, and use the specified cut file

`kidcut -i path/to/input/file.mp4 -o path/to/output_dir/ -c path/to/cut/file` all of the above, but -o will determine where to put the output file

-c is optional - if you don't provide the cut file, you will be given a list to choose form
-o is optional - if you don't provide output directory, will use same dir as source

`kidcut list` will list out the available cuts 

`kidcut list -i path/to/input/file.mp4 create <cut_name>` cut_name is the name you saw when you `kidcut list`

## CUT FILE FORMAT

Simple js file. [TKTKTK]

Went with js since it will allow for some interesting possibilities in generating timecodes.

## TODO
    * validation: make sure tc end is later than tc start
    * dont use cli log functions except in CLI related code
    * add support for supercut file with defined source files and codes to make one big supercut. basic idea is to make something like lightsaber-battle cut across all the films to one file 
    * put on npm
    * expose more output options
    * can run more cutters at once to speed up process?
    * generate time-code mappings from old to new
## MAYBE

    * Suppress cleanup behaviour? is it useful to have the pieces remaining?