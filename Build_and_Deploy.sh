## Build and deploy on Raspberry Pi

#Run this commend on the Pi to get the resposity:
#   git clone https://github.com/paulboxwell/simpleHTMLdocker.git

docker build -t my-apache2 .
docker run -dit --name my-running-app -p 8080:80 my-apache2
