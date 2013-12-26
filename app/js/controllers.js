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

    var currentBox = 0;
    var boxes = new Array("#top_rubik", "#back_rubik", "#left_rubik", "#front_rubik", "#right_rubik", "#bottom_rubik");

    var getBoxName = function getBoxName(nextPhoto) {
        var box = boxes[currentBox];
        if (nextPhoto) {
            currentBox = currentBox + 1;
        }
        if (currentBox > 5) {
            currentBox = 5;
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
  }])
  .controller('MyCtrl2', [function() {

  }]);
