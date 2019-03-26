$(document).ready(function(){


    Notification.requestPermission(function(status){
        console.log("Notification Permission ", status);
    });

    function displayNotification() {
        if (Notification.permission === 'granted'){
            navigator.serviceWorker.getRegistration()
            .then(function(reg) {
                var options = {
                    body : 'ini body notifikasi',
                    icon : 'images/man.png',
                    vibrate : [100,50,100],
                    data : {
                        dateOfArrival : Date.now(),
                        primaryKey : 1
                    },
                    actions : [
                        {action : 'explore', title : 'Kunjungi situs'},
                        {action : 'close',  title : 'Tutup'}
                    ]
                }
                reg.showNotification('Judul Notifikasi', options);
            })
        }
    }

    $('#btn-notification').on('click', function() {
        displayNotification();
    });

    function isOnline() {
        var connectionStatus = $('#connection-status');
        if(navigator.onLine){
            connectionStatus.html = '<p> anda online </p>';
        }else{
            connectionStatus.html = '<p> anda offline </p>';
        }
    }

    window.addEventListener('online', isOnline);
    window.addEventListener('offline', isOnline);
    isOnline();

});


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