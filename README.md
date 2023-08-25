# Digital Twin Builder Project

Work by Max Bastida, in partnership with Edward Wong, and supervised by Ben Adams

The purpose of this project is to investigate the development of an application to show 3D scenes generated from LiDAR scans and satellite imagery. This is undertaken as a SENG402 software engineering project at the University of Canterbury, in partnership with Eagle.

# Running the program

## Cloning the repository

In a terminal, type:

`git clone https://github.com/m-bastida/SENG402_DTB`

## Script selection

This project is currently in a testing phase, and all code is contained inside the `experimenting` folder. The file `experimenting\example_scene.html` is used to run different scripts and test functionality.

By changing line 20 in `experimenting\example_scene.html`, the imported script is selected, to see the result of different function tests.

## Steps to run on localhost

Open a terminal to the `SENG402_DTB` directory.

Run 

`npm install`

`http-server`

The program should be accessible at `localhost:8080/experimenting/example_scene.html`