# SSW.ServiceDetector

**Dependency**: this file requires jQuery 

**Install**: include this js into your webpage after jQuery

This library is based on the SSW Rule - [Do you detect service availability from the client?](https://rules.ssw.com.au/do-you-detect-service-availability-from-the-client)

Detect our ability to use various 3rd party services - by attempting to load the favicon from that service's website.
For example, youtube is completely blocked from inside china so we can't use any youtube features. 
  
Detection takes time so we trigger document-level jquery events to run code after the detection has finished
 `$(document).trigger("DetectServiceComplete", service);`

**EXAMPLE EVENT HANDLER:**
 
 ```
 $(document).on("DetectServiceComplete",
    function(event, service) {
        if (service.name === "youtube") { // we only fire one event type for all services so check the name
            console.log("init videos");
            initVideos();
        }
    }); 
 ```
    
 **AFTER EVENT, WE CAN ALSO READ FROM GLOBAL STATE:**
 
`if (window.serviceDetector.youtube.successful) {`
 
