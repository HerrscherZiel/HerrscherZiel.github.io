$(document).ready(function(){


//Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/serviceworker.js').then(function(reg) {
        // Registration was successful
        //console.log('ServiceWorker registration successful with scope: ', registration.scope);
        return navigator.serviceWorker.ready;
      }).then(function(registration) {
          document.getElementById('req-sync').addEventListener('click', function() {
            registration.sync.register('image-fetch').then(() => 
              {console.log('sync-registered');
          }).catch(function(err) {
              console.log('unable to fetch image. Error:', err);
          });
          });
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

  self.addEventListener('sync', function(event) {
        console.log('firing sync');
        if (event.tag === 'image-fetch'){
            console.log('sync event fired');
        }
  });

  function fecthImage() {
      console.log('firing: doSomeStuff');
      fetch('/images/man.png').then(function(response) {
          return response;
      }).then(function(text) {
          console.log('Request success ', text);
      }).catch(function (err) {
          console.log('Request failed ', err);
      })
  }