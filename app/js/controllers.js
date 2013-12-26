'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope',function($scope) {
    var _video = null,
        patData = null;

    $scope.showDemos = false;
    $scope.edgeDetection = false;
    $scope.mono = false;
    $scope.invert = false;

    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function (videoElem) {
        // The video element contains the captured camera data
        _video = videoElem;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            $scope.showDemos = true;
        });
    };

    $scope.onStream = function (stream, videoElem) {
        // You could do something manually with the stream.
    };

    $scope.retakeDisabled = true;
    $scope.analyzeDisabled = true;

    /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
    $scope.makeSnapshot = function makeSnapshot(nextPhoto) {
        if (_video) {
            var boxName = getBoxName(nextPhoto);
            var patCanvas = document.querySelector(boxName);
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            patData = idata;
        }
    };

    var currentBox = -1;
    var boxes = new Array("#top_rubik", "#back_rubik", "#left_rubik", "#front_rubik", "#right_rubik", "#bottom_rubik");

    Array.prototype.repeat= function(what, L){
     while(L) this[--L]= what;
     return this;
    }

    var analyzeBox = function analyzeBox(box) {
        var anCanvas = document.querySelector(box);
        Pixastic.process(anCanvas, "laplace", {edgeStrength:0.75, invert:false, greyLevel:0});
        anCanvas = document.querySelector(box);
        console.log("finished!");
        Pixastic.process(anCanvas, "desaturate", {average:false});
        console.log("finished!");
        anCanvas = document.querySelector(box);
        var h = anCanvas.height;
        var w = anCanvas.width;
        var numAngleCells = 360;
        var rhoMax = Math.sqrt(w * w + h * h);
        var anCtx = anCanvas.getContext('2d');
        var data = anCtx.getImageData(0, 0, h, w).data;
        var accum = [].repeat(0, rhoMax * numAngleCells);
        for (var i=0;i<w;i++) {
            for (var j=0;j<h;j++) {
                if (data[4*i + 4*w*j] > 150) {
                    houghAccClassical(i, j, w, h, numAngleCells, rhoMax, accum );
                }
            }
        }
        console.log(accum);
    };

    $scope.makeAnalysis = function makeAnalysis() {
        for (var i = 0;i < boxes.length; i++) {
            var box = boxes[i];
            console.log(box);
            analyzeBox(box);
        }
    };

    var getBoxName = function getBoxName(nextPhoto) {
        if (nextPhoto) {
            currentBox = currentBox + 1;
        }
        var box = boxes[currentBox];
        if (currentBox > -1) {
            currentBox = 1;
            $scope.analyzeDisabled = false;
        }
        $scope.retakeDisabled = false;
        return box;
    };

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    var houghAccClassical = function houghAccClassical(x, y, drawingWidth, drawingHeight, numAngleCells, rhoMax, accum) {
      var rho;
      var theta = 0;
      var thetaIndex = 0;
      x -= drawingWidth / 2;
      y -= drawingHeight / 2;
      for (; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
          rho = rhoMax + x * Math.cos(theta) + y * Math.sin(theta);
          rho >>= 1;
          accum[thetaIndex + numAngleCells * rho]++;
          //if (accum[thetaIndex] === undefined) accum[thetaIndex] = [];
          //if (accum[thetaIndex][rho] === undefined) {
          //    accum[thetaIndex][rho] = 1;
          //} else {
          //    accum[thetaIndex][rho]++;
          //}
          //console.log(thetaIndex);
          //console.log(rho);
          //console.log(accum[thetaIndex][rho]);
      
          //HSctx.beginPath();
          //HSctx.fillRect(thetaIndex, rho, 1, 1);
          //HSctx.closePath();
        }
    };
  }])
  .controller('MyCtrl2', [function() {

  }]);
