/* 
 * SSW Service Detector - Brendan Richards Dec 2018
 * =================================================
 * 
 * This js detects our ability to use various 3rd party services - by attempting to load the favicon from that service's website.
 * For example, youtube is completely blocked from inside china so we can't use any youtube features.
 * 
 * Detection takes time so we trigger document-level jquery events to run code after the detection has finished
 * $(document).trigger("DetectServiceComplete", service);
 * 
 * EXAMPLE EVENT HANDLER:
 * $(document).on("DetectServiceComplete",
 *   function(event, service) {
 *       if (service.name === "youtube") { // we only fire one event type for all services so check the name
 *           console.log("init videos");
 *           initVideos();
 *       }
 *   });
 *
 * AFTER EVENT, WE CAN ALSO READ FROM GLOBAL STATE:
 * if (window.serviceDetector.youtube.successful) {
 * 
 * 
*/

function ServiceForDetection(name, favicon) {
    this.name = name;
    this.favicon = favicon;
    this.testComplete = false;
    this.successful = false;
};


function DoDetectService(service) {
    var image = new Image();
    var timer = window.setTimeout(() => {
        console.log('Detect fail for ' + service.name);
        image.src = '';
        image.onload = null;
        image.onerror = null;
        service.testComplete = true;
        $(document).trigger("DetectServiceComplete", service);
    }, 1500);
    image.onload = function() {
        clearTimeout(timer);
        console.log('Detect pass for ' + service.name);
        service.successful = true;
        service.testComplete = true;
        $(document).trigger("DetectServiceComplete", service);
    };
    image.src = service.favicon;
}


$(document).ready(function() {

    window.serviceDetector = {
        youtube:   new ServiceForDetection("youtube", "https://youtube.com/favicon.ico"),
        google:    new ServiceForDetection("google", "https://google.com/favicon.ico"),
        facebook: new ServiceForDetection("facebook", "https://facebook.com/favicon.ico"),
        youku: new ServiceForDetection("youku", "https://static.youku.com/v1.0.166/index/img/favicon.ico")
    };

    for (var service in window.serviceDetector) {
        if (window.serviceDetector.hasOwnProperty(service)) {
            DoDetectService(window.serviceDetector[service]);
        }
    }
});

