:: Bat file to build and deploy a docker image.

:: Build the image
docker build -t my-apache2 .

:: run the image as a new contrainer with a specfied name.
docker run -dit --name my-running-app -p 8080:80 my-apache2
