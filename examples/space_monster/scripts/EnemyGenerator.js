function EnemyGenerator(engine, rocket) {

    var extraTime = 4000;
    var enemies = [
        
   
        {x: -50, y: -50, time: 1000, type:"UfoType1"}, 
        {x: -50, y: -50, time: 2000, type:"UfoType1"},
        {x: -50, y: -50, time: 3000, type:"UfoType1"},
        {x: -50, y: -50, time: 4000, type:"UfoType1"},
        {x: -50, y: -50, time: 5000, type:"UfoType1"},
        {x: -50, y: -50, time: 6000, type:"UfoType1"},
        {x: -50, y: -50, time: 7000, type:"UfoType1"},
        {x: -50, y: -50, time: 8000, type:"UfoType1"},
        {x: -50, y: -50, time: 9000, type:"UfoType1"},
        {x: -50, y: -50, time: 10000, type:"UfoType1"},
        
        {x: 100, y: -50, time: 20000, type:"UfoType1"}, 
        {x: 200, y: -50, time: 20000, type:"UfoType1"},  
        {x: 100, y: -50, time: 21000, type:"UfoType1"}, 
        {x: 200, y: -50, time: 21000, type:"UfoType1"},
        {x: 100, y: -50, time: 22000, type:"UfoType1"}, 
        {x: 200, y: -50, time: 22000, type:"UfoType1"},
        {x: 100, y: -50, time: 23000, type:"UfoType1"}, 
        {x: 200, y: -50, time: 23000, type:"UfoType1"},
        {x: 100, y: -50, time: 24000, type:"UfoType1"}, 
        {x: 200, y: -50, time: 24000, type:"UfoType1"}, 
        
      
        {x: 100, y: -50, time: 35000+extraTime, type:"UfoType2"},
        {x: 200, y: -50, time: 35000+extraTime, type:"UfoType2"},
        {x: 300, y: -50, time: 35000+extraTime, type:"UfoType2"},
        {x: 400, y: -50, time: 35000+extraTime, type:"UfoType2"},
        {x: 500, y: -50, time: 36000+extraTime, type:"UfoType2"},
        {x: 600, y: -50, time: 36000+extraTime, type:"UfoType2"},
        {x: 700, y: -50, time: 36000+extraTime, type:"UfoType2"},
        {x: 800, y: -50, time: 36000+extraTime, type:"UfoType2"},
        {x: -50, y: 100, time: 37000+extraTime, type:"UfoType2"},
        {x: -50, y: 200, time: 37000+extraTime, type:"UfoType2"},        
       
        
        {x: 100, y: -50, time: 54000+extraTime, type:"UfoType2"}, 
        {x: 200, y: -50, time: 54500+extraTime, type:"UfoType2"},  
        {x: 300, y: -50, time: 54000+extraTime, type:"UfoType2"}, 
        {x: 400, y: -50, time: 54500+extraTime, type:"UfoType2"},
        {x: 100, y: -50, time: 55000+extraTime, type:"UfoType2"}, 
        {x: 200, y: -50, time: 55500+extraTime, type:"UfoType2"},
        {x: 300, y: -50, time: 55000+extraTime, type:"UfoType2"}, 
        {x: 400, y: -50, time: 55500+extraTime, type:"UfoType2"},
        {x: 100, y: -50, time: 56000+extraTime, type:"UfoType2"}, 
        {x: 200, y: -50, time: 56500+extraTime, type:"UfoType2"},
        {x: 300, y: -50, time: 56000+extraTime, type:"UfoType2"},
        {x: 400, y: -50, time: 56500+extraTime, type:"UfoType2"},
        
        
    ].reverse();


    this.generateEnemies = function (elapsedTime) {
        
        var enemy = enemies.pop();
        if (!enemy) {
            return;
        }
        if (enemy.time < elapsedTime) {
            if(enemy.type === "UfoType1"){
                new UfoType1(engine,rocket).setPosition(enemy.x,enemy.y).setImage("ufo").setWidthAndHeight(30,10).setSpeedX(2).setSpeedY(-0.5).setHealth(2);
            }else if(enemy.type === "UfoType2"){
                new UfoType3(engine,rocket).setPosition(enemy.x,enemy.y).setImage("ufo").setWidthAndHeight(30,10).setHealth(2);
            }else if(enemy.type === "UfoType3"){
                new UfoType3(engine,rocket).setPosition(enemy.x,enemy.y).setImage("ufo").setWidthAndHeight(30,10).setHealth(2);
            }
        } else {
            enemies.push(enemy);
        }


    };


}

