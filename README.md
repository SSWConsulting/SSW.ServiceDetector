# SSW.ServiceDetector

Dependency: this files requires jQuery 
Install: include this js into you webpage after jQuery

This js detects our ability to use various 3rd party services - by attempting to load the favicon from that service's website.
For example, youtube is completely blocked from inside china so we can't use any youtube features. 
  
Detection takes time so we trigger document-level jquery events to run code after the detection has finished
 `$(document).trigger("DetectServiceComplete", service);`

*EXAMPLE EVENT HANDLER:*
 
 ```
 $(document).on("DetectServiceComplete",
    function(event, service) {
        if (service.name === "youtube") { // we only fire one event type for all services so check the name
            console.log("init videos");
            initVideos();
        }
    }); 
 ```
    
 *AFTER EVENT, WE CAN ALSO READ FROM GLOBAL STATE:*
`if (window.serviceDetector.youtube.successful) {`
 
