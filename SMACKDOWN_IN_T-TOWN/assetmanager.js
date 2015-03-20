/**
 * Manages assets associate with game for upload prior to game state beginning.
 *
 * @author PROVIDED
 */
function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
}

/**
 * Adds assests to internal queue for download.
 * 
 * @param   path    <String>    Location of asset.
 */
AssetManager.prototype.queueDownload = function (path) {
    //console.log("Queueing " + path);
    this.downloadQueue.push(path);
}

/**
 * Returns state of asset download.
 * 
 * @return *anonymous   <boolean>   True if all assets have downloaded.
 */
AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
}

/**
 * Loads all assets prior to engine instantiation.
 *
 * @param   callback    <function>  Function to call after method completes.
 */
AssetManager.prototype.downloadAll = function (callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var img = new Image();
        var that = this;

        var path = this.downloadQueue[i];
        //console.log(path);

        img.addEventListener("load", function () {
            //console.log("Loaded " + this.src);
            that.successCount++;
            if(that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            //console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        img.src = path;
        this.cache[path] = img;
    }
}

/**
 * Returns the appropriate cached asset.
 *
 * @param   path        <String>    Path to asset.
 * @return  *anonymous  <anonymous> Asset object.
 */
AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
}
