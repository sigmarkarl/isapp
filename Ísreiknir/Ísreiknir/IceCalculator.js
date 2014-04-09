var iceApp = angular.module("iceApp", ['ui.bootstrap']);

iceApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

});

iceApp.controller('CanvasCtrl', function ($scope, $timeout, $document, $window, $modal, $log) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    
    var smallContainer = {
         "containerName":"460 L",         
         "selection" : "460-small-container.JPG",
         "backround" : '460-small-bisect.JPG',
         "front" : '460-small-bisect-frontPerfect.png',
         "height" : -170,  
            "width" : 510,
            "_x" : 45,
            "_y" : 265,
            "totalWeight" : 422,
            "type" : "460"
    };
    var largeContainer = {
        "containerName":"660 L",
        "selection" : "660-large-container.JPG",
         "backround" : '660-large-bisect.JPG',
         "front" : '660-large-bisect-frontPerfect.png',
         "height" : -215,  
            "width" : 510,
            "_x" : 45,
            "_y" : 286,
            "totalWeight" : 622,
            "type" : "660"
    };

    $scope.canvasWidth = 600;
    $scope.canvasheight = 400;

    var aspectRatio = $scope.canvasWidth/$scope.canvasheight;
    
    var _height; 
    var _width;
    var _x;
    var _y;
    var _drawHeight;

    // currently hardcoded for smaller container
    var maxDrawHeight = $scope.canvasheight/_drawHeight; //gamla gildið -170 / 400 ratio --2,352941
    var maxDrawWidth = $scope.canvasWidth/1.17647;   //gamla gildið  510 / 600 ratio  600
    var x = $scope.canvasheight/8.88888888888; // gamla gildið 45 / 400 ratio 0,1125
    var y = $scope.canvasWidth/_y;  // /2.264150943396264150943;// gamla gildið 265 / 600 ratio  


    var totalWeight;
    $scope.maxCatch = totalWeight;

    $scope.isFull = false;
    $scope.isContainerFull = "";
    $scope.catchWeight = 0;
    $scope.noDays = 0;
    $scope.oceanTemperature = 0;
    $scope.airTemperature = 0;
    $scope.iceNeed = 0;
    $scope.airTemperatureWarning = "";
    $scope.oceanTemperatureWarning = "";
    $scope.yeallowWarining = false;
    $scope.redwarning = false;
    $scope.airRed = "";


    context.globalAlpha = 1.0;
    context.globalCompositeOperation = "xor";

    var imageObj = new Image();
    var imageObjFront = new Image();

    // MODAL----------------------------------------
   $scope.items = [largeContainer ,smallContainer];
  $scope.openModal = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      dialogFade: false,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
          $scope.setContainer(selectedItem);      
      }, function () {
      $log.info('Modal dismissed at: ' + new Date());
     });
     };

    //-----------------------------------------------


    function setCanvas(container){
        imageObj.src = container.backround;
        imageObjFront.src = container.front;
        _height = container.height;
        _width = container.width;
        _x = container._x;
        _y = 600/container._y;
        _drawHeight = 400/container.height;
        totalWeight = container.totalWeight;
        $scope.maxCatch = container.totalWeight;
        maxDrawHeight = $scope.canvasheight/_drawHeight; //gamla gildið -170 / 400 ratio --2,352941
        maxDrawWidth = $scope.canvasWidth/1.17647;   //gamla gildið  510 / 600 ratio  600
        x = $scope.canvasheight/8.88888888888; // gamla gildið 45 / 400 ratio 0,1125
        y = $scope.canvasWidth/_y;  // /2.264150943396264150943;// gamla gildið 265 / 600 ratio  
        drawBackround();
    }

    $scope.smallContainerDisplay = true;
   
    $scope.init = function(){
        if($scope.smallContainerDisplay === true){
            setCanvas(smallContainer);
        }else{
            setCanvas(largeContainer);
        }

       // $scope.openModal();
        $timeout(function() {
            resize()            
            redraw()
            }, 100);
        //drawBackround();
    };

    $scope.refresh = function(){
        if($scope.smallContainerDisplay === true){
            setCanvas(smallContainer);
        }else{
            setCanvas(largeContainer);
        }

        
        $timeout(function() {
            resize()            
            redraw()
            }, 100);
        //drawBackround();
    };

    function resize(){
        if($document[0].body.clientWidth < 600){
            $scope.canvasWidth = $document[0].body.clientWidth;    
            canvas.width = $scope.canvasWidth;
            $scope.canvasheight = $scope.canvasWidth/aspectRatio;  
            canvas.height =  $scope.canvasheight;
        }

        maxDrawHeight = $scope.canvasheight/_drawHeight; //gamla gildið -170 / 400 ratio --2,352941
        maxDrawWidth = $scope.canvasWidth/1.17647;   //gamla gildið  510 / 600 ratio  600
        x = $scope.canvasheight/8.88888888888; // gamla gildið 45 / 400 ratio 0,1125
        y = $scope.canvasWidth/_y;// gamla gildið 265 / 600 r
    }


    $window.onresize = function( ){      
        if($document[0].body.clientWidth < 600){
            $scope.canvasWidth = $document[0].body.clientWidth;    
            canvas.width = $scope.canvasWidth;
            $scope.canvasheight = $scope.canvasWidth/aspectRatio;  
            canvas.height =  $scope.canvasheight;
        }

        maxDrawHeight = $scope.canvasheight/_drawHeight; //gamla gildið -170 / 400 ratio --2,352941
        maxDrawWidth = $scope.canvasWidth/1.17647;   //gamla gildið  510 / 600 ratio  600
        x = $scope.canvasheight/8.88888888888; // gamla gildið 45 / 400 ratio 0,1125
        y = $scope.canvasWidth/_y;// gamla gildið 265 / 600 ratio  

        drawBackround();
        drawScene();
    };

    function drawBackround(){
        context.drawImage(imageObj, 0,0, $scope.canvasWidth, $scope.canvasheight);
    };
   
    function drawFront(){
        context.drawImage(imageObjFront,0,0, $scope.canvasWidth, $scope.canvasheight);
    };

    function redraw(){
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);
        drawBackround();
        drawScene();
    }    

    $scope.setContainer = function(container){
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);
         if(container.type === "440"){          
            setCanvas(smallContainer);
            $scope.smallContainerDisplay = true;
        }
        if(container.type === "660"){
            setCanvas(largeContainer);
            $scope.smallContainerDisplay = false;
        }
        $scope.maxCatch = container.totalWeight;
        $scope.refresh();       
    }

    $scope.switchContainer = function(type){
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);       
        if(type === 440){          
            setCanvas(smallContainer);
            $scope.smallContainerDisplay = true;
        }
        if(type === 660){
            setCanvas(largeContainer);
            $scope.smallContainerDisplay = false;
        }
        $scope.maxCatch = totalWeight;
        $scope.refresh();
    }

    $scope.catchChange = function(){
        if($scope.catchWeight === null){
             $scope.catchWeight = 0;
        }
        if($scope.noDays === undefined){
             $scope.catchWeight = 0;
        }
        if($scope.catchWeight > totalWeight){
             $scope.catchWeight = totalWeight;
        }
                
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);     
        //for input type number 
        $scope.catchWeight = parseInt($scope.catchWeight);   
        var num = $scope.catchWeight * maxDrawHeight;
        drawBackround();
        drawScene(num);
    }

    $scope.noDaysChange = function(){    
        if($scope.noDays > 15){
             $scope.noDays = 15;
        }
        /*if($scope.noDays === null){
             $scope.noDays = 0;
        }
        if($scope.noDays === undefined){
             $scope.noDays = 0;
        }*/
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);
        
        $scope.noDays = parseInt($scope.noDays);   
        var num = $scope.noDays * maxDrawHeight;
        drawBackround();
        drawScene();
    }

    $scope.oceanTemperatureChange = function(){ 
        if($scope.oceanTemperature > 20){
             $scope.oceanTemperature = 20;
        }
       /* if($scope.oceanTemperature === null){
             $scope.oceanTemperature = 0;
        }
        if($scope.oceanTemperature === undefined){
             $scope.oceanTemperature = 0;
        }  */  
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);
        
        $scope.oceanTemperature = parseInt($scope.oceanTemperature);   
        var num = $scope.oceanTemperature * maxDrawHeight;
        drawBackround();
        drawScene();
    }


    $scope.airTemperatureChange = function(){
        if($scope.airTemperature > 20){
             $scope.oceanTemperature = 20;
        }
      /* if($scope.airTemperature === null){
             $scope.oceanTemperature = 0;
        }
        if($scope.airTemperature === undefined){
             $scope.oceanTemperature = 0;
        } */        
        context.clearRect(0,0,$scope.canvasWidth, $scope.canvasheight);        
        $scope.airTemperature = parseInt($scope.airTemperature);   
        var num = $scope.airTemperature *maxDrawHeight;
        
        drawBackround();
        drawScene();
    }
 
    function updateIce(){
        
        var initialIce = parseInt($scope.catchWeight)*0.0114*$scope.oceanTemperature;//oceantemp
        var dailyIce = parseInt($scope.catchWeight)*0.015*$scope.airTemperature*$scope.noDays;//airtemp

        if(isNaN(initialIce)){
            initialIce = 0;
        }
        if(isNaN(dailyIce)){
            dailyIce = 0;
        }

        $scope.iceNeed = initialIce + dailyIce;
        $scope.combinedWeight = $scope.iceNeed + $scope.catchWeight;
        $scope.combinedWeight = Math.round($scope.combinedWeight);
        $scope.iceNeed = Math.round($scope.iceNeed);
    
        //skóflan er 4kg , fatan er 5kg
        $scope.schovels = Math.round($scope.iceNeed/4);
        $scope.buckets = Math.round($scope.iceNeed/5);

        if($scope.iceNeed === undefined){           
           $scope.iceNeed = 0;          
        }
       
        if(isNaN($scope.combinedWeight)){
            $scope.combinedWeight = 0;
        }
    }

    
    function drawScene(){
        updateIce();

        var check = parseInt($scope.iceNeed,10);
        var check2 = parseInt($scope.catchWeight,10);
        var ulticheck = check + check2; 

        context.fillStyle = "white";
        context.font = "bold 20px Segoe UI Semibold";
        context.fillText("Lítrar : "+ totalWeight , 250, 200);
        
        drawIce();
        drawFish();
        
        if(ulticheck > totalWeight){
            $scope.isFull = true;               
            $scope.airRed = "alert alert-error"
            $scope.Warning = "Of mikið er í karinu!"  
        } else{
            $scope.airRed = "";
            $scope.Warning = "";
            $scope.isFull = false;
        }
        
        drawFront();    
    }
    
    $scope.fillcontainer = function(){
        for(var i = totalWeight ; i > 0 ; i--){           
            maxWeight = calculateFill(i);
            if(Math.round(calculateFill(i)) <= totalWeight){  
                $scope.catchWeight = i;
                drawScene();
                return;
            }
        }
    }

    function calculateFill(i){
        var weight = 0;
        var iIce = 0;
        var dIce = 0;
        var maxWeight = 0;
        var iceNeed = 0; 
        iIce =   i*0.0114*$scope.oceanTemperature;
        dIce =   i*0.015*$scope.airTemperature*$scope.noDays;
        iceNeed = iIce + dIce;
        maxWeight = iceNeed + i;

        return maxWeight;
    }

    function drawIce() {
        context.beginPath();

        var IceY = ($scope.catchWeight*maxDrawHeight/totalWeight);
        var IceHeight = ($scope.iceNeed*maxDrawHeight/totalWeight);     
    
        if($scope.catchWeight === 0){    
            context.rect(x, y, maxDrawWidth , IceHeight); 
        }
        else{
            context.rect(x, IceY+y, maxDrawWidth ,IceHeight); 
        }
        context.fillStyle = "#ccddff";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "#666666";
        context.stroke();    
    }
    
    function drawFish(data) {

        var amount = $scope.catchWeight * maxDrawHeight;
        amount /= totalWeight;
        context.beginPath();
        context.rect(x, y, maxDrawWidth, amount); 
        context.fillStyle = "#C0C0C0";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "#C0C0C0";
        context.stroke();  
    }

    function drawFillLine(){
        context.beginPath(); 
        context.rect(  _x , 95, maxDrawWidth, 2); 
        context.fillStyle = "#FF0000";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "#FF0000";
        context.stroke();    
    }

    canvas.width = $scope.canvasWidth;
    canvas.height = $scope.canvasheight;
    context.globalAlpha = 1.0;
    context.beginPath();    
});