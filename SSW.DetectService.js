/* 
 * SSW Service Detector - Brendan Richards Dec 2018 
 * ============================================================================
 * 
 * This js detects our ability to use various 3rd party services that may not be available behind the China firewall by attempting to load the favicon from that service's website.
 * For example, youtube is completely blocked from inside china so we can't use any youtube features.
 *
 * Include this library on pages where you want to test whether the services are available
 *
 * Browsers on Apple mobile devices, iphone/ipads, were not handling the setTimeout and clearTimeout, so as a workaround,
 * if it is detected that the user is on an Apple mobile device and their ip geolocation is "cn", then the services is deemed as unavailable.
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
}

function DoDetectService(service) {
    var image = new Image();
    var timer = window.setTimeout(function () {
        //console.log('Detect fail for ' + service.name);
        image.src = '';
        image.onload = null;
        image.onerror = null;
        service.testComplete = true;
        $(document).trigger("DetectServiceComplete", service);
    }, 1500);
    image.onload = function () {
        clearTimeout(timer);
        //console.log('Detect pass for ' + service.name);
        service.successful = true;
        service.testComplete = true;
        $(document).trigger("DetectServiceComplete", service);
    };
    image.src = service.favicon;
}

function DoDetectServiceBasedOnCountryCode(countryCode) {
    //console.log('DetectBasedOnCountry: ', countryCode);
    //console.log('User based in China: ', countryCode.toLowerCase() === 'cn');
    for (var service in serviceDetector) {
        if (window.serviceDetector.hasOwnProperty(service)) {
            window.serviceDetector[service].testComplete = true;
            if (countryCode.toLowerCase() === 'cn') {
                window.serviceDetector[service].successful = service.toLowerCase() === 'youku' ? true : false;                
            } else {                
                window.serviceDetector[service].successful = true;
            }
            $(document).trigger("DetectServiceComplete", service);
        }
    }
    //console.log('window.ServiceDetector object after: ', window.serviceDetector);
}

function isAppleMobileDevice() {
    var match = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    //console.log('isAppleMobileDevice: ', match);
    return match;
}

$(document).ready(function () {

    window.serviceDetector = {
        vimeo: new ServiceForDetection("vimeo", "https://vimeo.com/favicon.ico"),
        youtube: new ServiceForDetection("youtube", "https://youtube.com/favicon.ico"),
        youku: new ServiceForDetection("youku", "https://static.youku.com/v1.0.166/index/img/favicon.ico"),
        google: new ServiceForDetection("google", "https://www.google.com/favicon.ico"),
        facebook: new ServiceForDetection("facebook", "https://facebook.com/favicon.ico")
    };

    if (isAppleMobileDevice()) {
        $.ajax({
            type: 'GET',
            url: 'https://ipapi.co/country',
            success: function (data) {
                DoDetectServiceBasedOnCountryCode(data);
            }
        });
    } else {
        for (var service in window.serviceDetector) {
            if (window.serviceDetector.hasOwnProperty(service)) {
                DoDetectService(window.serviceDetector[service]);
            }
        }
    }    
});