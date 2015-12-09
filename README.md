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

* edit config.js with output dir

`kidcut name-of-cut -i "path/to/film"`

## TODO

    * allow passing in path to a cut file
    * -c, --cuts list all cuts available
    * -o, --output pass in output dir
    * expose more output options
