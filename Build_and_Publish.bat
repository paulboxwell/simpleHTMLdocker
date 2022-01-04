:: Bat file to build and publish a docker image.

:: Build the image
docker build -t my-apache2 .

:: Tag the image with a target repository & tag  Command: "docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]"
docker tag my-apache2 paulboxwell/my-apache2:latestbat

:: Push to the build image to the repository on Docker Hub.
docker push paulboxwell/my-apache2:latestbat