;(function(exports) {

    // resourcer private vars;
    var resources = {};
    var queue = []; // unloaded resources
    var finished = false;
    var counter = 0;

    var Resourcer = function(arr, onReady) {
        var self = this;
        queue = arr;
    
        this.get = function(name) {
            var thing = resources[name];
            if (!thing) {throw  (name + " was not found")};
            return thing;
        };
        this.isReady = function() {
            return finished;
        };
        this.load = function(callback) {
            var i, total, onLoad, name, url, rsc, req;
            total = queue.length; 

            for (i = 0; i < total; i++) {

                name = queue[i].name;
                url = queue[i].url;

                if (isJson(url)) {
                    rsc = {};
                    req = new XMLHttpRequest();
                    req.onload = function() { 
                        counter++;
                        rsc.json = JSON.parse(this.responseText); 
                        finished = counter === total;
                        window.durp = rsc;
                        if (callback) callback(name,counter,total);
                        if (finished && onReady) onReady();
                    };
                    req.open("get", url, true);
                    req.overrideMimeType("application/json"); 
                    req.send();

                } else {

                    // function called when rsc is ready
                    onLoad = (function(name,index) {
                        return function(){ 
                            counter++;
                            finished = counter === total;
                            if (finished && onReady) onReady();
                            if (callback) callback(name,counter,total);
                        };
                    })(name, i);

                    // bind load event to function
                    if (isPng(url)) {
                        rsc = new Image();
                        rsc.addEventListener('load', onLoad, false);
                    } else {
                        rsc = new Audio();
                        rsc.addEventListener('canplaythrough', onLoad, false);
                    }

                }

                rsc.src = url;
                rsc.name = name;
                resources[name] = rsc;
            }

            // edge case when no resources passed
            if (total === 0) {
                finished = true;
            }
        }
    };

    var isPng = function(url) {
        return /\.png$/.test(url);
    }
    var isJson = function(url) {
        return /\.json$/.test(url);
    }

    exports.Resourcer = Resourcer;

})(this);
