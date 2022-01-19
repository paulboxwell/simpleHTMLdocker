//=============================================================================
// PONG
//=============================================================================

Pong = {

  Defaults: {
    width:     document.documentElement.clientWidth,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:    document.documentElement.clientHeight,   // logical canvas height (ditto)
    wallWidth: 6,
    balls:     200,
    stats:     false  // true to show statistics
  },

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    this.cfg    = cfg;
    this.runner = runner;
    this.width  = runner.width;
    this.height = runner.height;
    this.court  = Object.construct(Pong.Court,  this);
    this.balls  = this.constructBalls();
    this.runner.start();
  },

  constructBalls: function() {
    var balls = [];
    for(var n = 0 ; n < this.cfg.balls ; n++)
      balls.push(Object.construct(Pong.Ball, this,Game.random(0,this.width),Game.random(0,this.height),Game.random(1,5),Game.random(0,200)));
    return balls;
  },

  addball: function() {
    this.balls.push(Object.construct(Pong.Ball, this,Game.random(0,this.width),Game.random(0,this.height),Game.random(1,5),Game.random(0,200)));
  },

  addball_c: function(c,s,z,r) {
    this.balls.push(Object.construct(Pong.Ball, this,Game.random(0,this.width),Game.random(0,this.height),z,r));
    this.balls[this.balls.length-1].color = c;
    this.balls[this.balls.length-1].sterial = s;
  },

  update: function(dt) {

    //add eggs randomly
    if (Game.random(0,1)>0.95)
    {
      this.addball_c("rgb(0,255,0)",true,Game.random(1,5),0);
    }
    // add fish randomly
      if (Game.random(0,1)>0.995)
      {
        this.addball_c("rgb(" + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ")",false,Game.random(1,5),Game.random(100,400));
      }
    for(var n = 0 ; n < this.balls.length ; n++) {
      //Hatch
      if (this.balls[n].egg == true)
      {
        this.balls[n].radius += 0.0005;
        this.balls[n].age += 3;
        if (this.balls[n].radius > 5)
        {
          if (this.balls[n].sterial == false)
          {
            this.balls[n].radius *= 0.75;
            this.balls[n].egg = false;
            this.balls[n].velocity = 100;
            this.balls[n].age *= this.balls[n].age / 100;
          }
          else
          {
            this.balls[n].radius = 5;
          }
        }
      }
      else
      {
        //Birth
        if (this.balls[n].radius > 10)
        {
          this.balls[n].radius -= this.balls[n].eggsize/2;
          this.addball_c(this.balls[n].color,false,this.balls[n].eggsize, this.balls[n].range);
        }
        //Age
        this.balls[n].age -= 1;
        if (this.balls[n].age <= 0)
        {
          //Die of old age
          this.balls[n].egg = true;
          this.balls[n].sterial = true;
          this.balls[n].velocity = 0;
          this.balls[n].color = "rgb(200,50,50)";
        }
      }

    }
    
    //Colision detection  (1/4)
    for(var n = 0 ; n < this.balls.length ; n++) {
      if (this.balls[n].egg == false && this.balls[n].dead == false)
      {
        for(var m = 0 ; m < this.balls.length ; m++) {
          var dist = Game.getdist(this.balls[n].x,this.balls[n].y,this.balls[m].x,this.balls[m].y);
          if (dist < this.balls[n].radius + this.balls[m].radius && n != m) {
            if (this.balls[m].egg == true)
            {
              // hatched vs egg
              this.health = 10;
              this.balls[n].radius += this.balls[m].radius/3;
              this.balls[n].velocity -= this.balls[m].radius;
              this.balls[m].dead = true;
            }
            else
            {
              // hatched vs hatched
              //directiondiff =  this.balls[n].direction - this.balls[m].direction;
              //directiondiff *= directiondiff;
              //if (directiondiff < 1)
              //{

              //}
              /*this.balls[n].health -= 2;
              if (this.balls[n].health <0)
              {
                this.balls[m].radius += this.balls[n].radius;
                this.balls[n].dead = true;
              }
              */
              if (this.balls[n].velocity > this.balls[m].velocity)
              {
                this.balls[n].velocity += 0.3;
                this.balls[m].velocity -= 0.3;
              }
              
            }

            
            // Conservation of momentum formular:  http://canu.ucalgary.ca/map/classes/info/ualberta/collisions_2D/applethelp/lesson/lesson_1.html
            // create functions for these collisions. Polar in (angel, velocity) - 
            /*
            diff = (this.balls[n].direction - this.balls[m].direction) / (this.balls[n].direction + this.balls[m].direction);
            massn = this.balls[n].radius * this.balls[n].radius;
            massm = this.balls[m].radius * this.balls[m].radius;
            this.balls[n].direction += diff * (1/ (massn + massm) * massn);
            this.balls[m].direction -= diff * (1/ (massn + massm) * massm);
            */

            //if (this.balls[n].radius <= this.balls[m].radius && this.balls[n].velocity < this.balls[m].velocity && this.balls[m].color != this.balls[n].color )
            //{
              //this.balls[n].dead = true;
              //this.balls[m].radius += 0.1;
            //}
            //else 
            //if (this.balls[n].velocity <= this.balls[m].velocity)
            //{
              //this.balls[n].color = this.balls[m].color;
            //}
          }
        }
      }
      
      this.balls[n].health -= this.balls[n].velocity/50000;
      if (this.balls[n].health < 0)
      {
        //die of starvation
        this.balls[n].egg = true;
        this.balls[n].sterial = true;
        this.balls[n].velocity = 0;
        this.balls[n].color = "rgb(200,50,50)";
      }
      
    }

    //inputs  (2/4)
    for(var n = 0 ; n < this.balls.length ; n++) {
      if (this.balls[n].egg == false)
      {
        if (this.balls[n].velocity > 100)
        {
          this.balls[n].velocity -= 0.1;
        }
        else
        {
          this.balls[n].velocity += 0.1;
        }
      }
      var closest_id;
      var closest_dist = 1000;

      for(var m = 0 ; m < this.balls.length ; m++) {
        var dist = Game.getdist(this.balls[n].x,this.balls[n].y,this.balls[m].x,this.balls[m].y);
        if(dist < closest_dist && m != n)
        {
          closest_id = m;
          closest_dist = dist;
        }
      }

      //Shole behaviour (hard programmed - remove when using AI)
      if (closest_dist < this.balls[n].range)
      {
        if (this.balls[closest_id].egg == true)
        {
          //move toward egg
          temp = Game.getAngle(this.balls[n].x,this.balls[n].y, this.balls[closest_id].x, this.balls[closest_id].y)
          this.balls[n].direction = ((temp + Math.PI/2) + this.balls[n].direction*10)/11;
        }
        else
        {
          var diff = this.balls[n].direction - this.balls[closest_id].direction
          if (diff < 0)
          {
            this.balls[n].direction += 0.02;
          }
          else
          {
            this.balls[n].direction -= 0.02;
          }
       }
      }
    }

    //newballsplease (3/4)
    var newballs = []; //creates a new list with the dead ones removed.
    for(var n = 0 ; n < this.balls.length ; n++){
      if (this.balls[n].dead == false) {
        newballs.push(this.balls[n])
      }
    }
    this.balls = newballs;

    //movement update (4/4)
    for(var n = 0 ; n < this.balls.length ; n++)
      this.balls[n].update(dt);
  },

  draw: function(ctx) {
    this.court.draw(ctx);
    for(var n = 0 ; n < this.balls.length; n++)
      this.balls[n].draw(ctx);
  },



  // Key press commands

  onkeydown: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: this.addball();    break;
    }
  },

  onkeyup: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: this.addball();    break;
    }
  },

  //=============================================================================
  // COURT
  //=============================================================================

  Court: {

    initialize: function(pong) {
      var w  = pong.width;
      var h  = pong.height;
      var ww = pong.cfg.wallWidth;

      this.walls = [];
      this.walls.push({x: 0,    y: 0,      width: w,  height: ww});
      this.walls.push({x: 0,    y: h - ww, width: w,  height: ww});
      this.walls.push({x: 0,    y: 0,      width: ww, height:  h});
      this.walls.push({x: w-ww, y: 0,      width: ww, height:  h});
    },

    draw: function(ctx) {
      ctx.fillStyle = '#F08010';
      for(var n = 0 ; n < this.walls.length ; n++)
        ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
    }

  },

  //=============================================================================
  // BALL
  //=============================================================================

  Ball: {

    initialize: function(pong, i, j, startsize, eyerange) {
      this.pong    = pong;
      this.eggsize = startsize + Game.random(-0.1,0.1);
      this.range   = eyerange + Game.random(-5,5);
      this.radius  = this.eggsize;
      this.minX    = pong.cfg.wallWidth + this.radius;
      this.minY    = pong.cfg.wallWidth + this.radius;
      this.maxX    = pong.width  - pong.cfg.wallWidth - this.radius;
      this.maxY    = pong.height - pong.cfg.wallWidth - this.radius;
      this.x       = i;
      this.y       = j;
      this.direction = 0;
      this.velocity = 0;
      this.dx      = (this.velocity * Game.getSinCos("sin", this.direction));
      this.dy      = (this.velocity * Game.getSinCos("cos", this.direction));
      this.color   = "rgb(" + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ")";
      this.dead    = false;
      this.health  = 10;
      this.egg     = true;
      this.age     = 0;
      this.sterial = false;
    },

    toJSON(){
      return {
        color: this.color,
        radius: this.radius
      }
    },

    update: function(dt) {

      this.direction = this.direction + Game.random(-0.05,0.05);

      this.velocity = this.velocity + Game.random(-0.2,0.2);

      this.dx      = (this.velocity * Game.getSinCos("sin", this.direction));
      this.dy      = (this.velocity * Game.getSinCos("cos", this.direction));

      this.x = this.x + (this.dx * dt);
      this.y = this.y + (this.dy * dt);

      if ((this.dx > 0) && (this.x > this.maxX)) {
        this.x = this.minX;
        //this.dx = -this.dx;
      }
      else if ((this.dx < 0) && (this.x < this.minX)) {
        this.x = this.maxX;
        //this.dead = true;
        //this.dx = -this.dx;
      }

      if ((this.dy > 0) && (this.y > this.maxY)) {
        this.y = this.minY;
        //this.dy = -this.dy;
      }
      else if ((this.dy < 0) && (this.y < this.minY)) {
        this.y = this.maxY;
        //this.dy = -this.dy;
      }
    },

    draw: function(ctx) {
      var w = h = this.radius * 2;
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      ctx.fill();
      ctx.closePath();

      if (this.egg == false) {
        ctx.beginPath();              
        ctx.lineWidth = "1";
        ctx.strokeStyle = this.color;  // Green path
        ctx.moveTo(this.x - Game.getSinCos("sin", this.direction + 0.5*3.145)*(this.radius), this.y - Game.getSinCos("cos", this.direction + 0.5*3.145)*(this.radius));
        ctx.lineTo(this.x - Game.getSinCos("sin", this.direction)*(20+this.radius), this.y - Game.getSinCos("cos", this.direction)*(20+this.radius));
        ctx.lineTo(this.x - Game.getSinCos("sin", this.direction - 0.5*3.145)*(this.radius), this.y - Game.getSinCos("cos", this.direction - 0.5*3.145)*(this.radius));
        ctx.stroke();  // Draw it
      }
    },
/*
    getx: function() {
      return this.x;
    },

    gety: function() {
      return this.y;
    }
*/
  }

}; // Pong
