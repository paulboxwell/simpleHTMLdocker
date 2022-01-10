# simpleHTMLdocker
This repositoy is designed to deploy a website. The website could be simple or complex,
so long as it is contained within the .\public-html directory.

There is an example website in this directory by default.

To deploy the website to a raspberry pi, first turn on the pi, connect it to the internet and open the command terminal. then follow the below instructions:


On raspberry Pi:

1 - Clone repositroy with this command:

  git clone https://github.com/paulboxwell/simpleHTMLdocker.git


2 - move into the new directroy

  cd simpleHTMLdocker

3 - run .sh file with 
  
  bash Build_and_Deploy.sh
  
Alternative step 3 - manually with:
  
  docker build -t my-apache2 .
  docker run -dit --name my-running-app -p 8080:80 my-apache2

