document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    console.log("device ready");
    var push = PushNotification.init({
        android:{}
    });

    push.on('registration', function (data) {
        // data.registrationId
        console.log(data.registrationId);
    });

    push.on('notification', function (data) {
        alert("Title:"+data.title+" Message:"+ data.message);
    });

    push.on('error', function (e) {
        console.log(e.message)
    })}