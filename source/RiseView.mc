using Toybox.WatchUi;
using Toybox.Communications as Comm;
using Toybox.Sensor;
using Toybox.Graphics;
using Toybox.System;
using Toybox.Lang;
using Toybox.Time.Gregorian;
using Toybox.Sensor;
using Toybox.Application;
using Toybox.Timer;

class RiseView extends WatchUi.View {
    var dataTimer = new Timer.Timer();
    var string_HR;
    var url = "https://receivedata-nmx2zrouca-uc.a.run.app";
    // Time interval variable
    var timer = 5000;

    function initialize() {
        View.initialize();
        // Set up a timer
        dataTimer.start(method(:timerCallback), timer, true);
    }

    function timerCallback() {
        var sensorInfo = Sensor.getInfo();
        var xAccel = 0;
        var yAccel = 0;
        var hR = 0;
        var altitude = 0;
        var heading = 0;
        var xMag = 0;
        var yMag = 0;
        var zMag = 0;
        var pressure = 0;
        var temp = 0;
        var stress = 0;

        // Collect Data
        // Accelerometer
        if (sensorInfo has :accel && sensorInfo.accel != null) {
            var accel = sensorInfo.accel;
            xAccel = accel[0];
            yAccel = accel[1];
        } else {
            xAccel = 0;
            yAccel = 0;
        }
        // Heart Rate
        if (sensorInfo has :heartRate && sensorInfo.heartRate != null) {
            hR = sensorInfo.heartRate;
        } else {
            hR = 0;
        }
        // Altitude
        if (sensorInfo has :altitude && sensorInfo.altitude != null) {
            altitude = sensorInfo.altitude;
        } else {
            altitude = 0;
        }
        // Heading
        if (sensorInfo has :heading && sensorInfo.heading != null) {
            heading = sensorInfo.heading;
        } else {
            heading = 0;
        }
        // Magnetometer
        if (sensorInfo has :mag && sensorInfo.mag != null) {
            var mag = sensorInfo.mag;
            xMag = mag[0];
            yMag = mag[1];
            zMag = mag[2];
        } else {
            xMag = 0;
            yMag = 1;
            zMag = 2;
        }
        // Pressure
        if (sensorInfo has :pressure && sensorInfo.pressure != null) {
            pressure = sensorInfo.pressure;
        } else {
            pressure = 0;
        }
        // Temperature
        if (sensorInfo has :temp && sensorInfo.temp != null) {
            temp = sensorInfo.temp;
        } else {
            temp = 0;
        }
        // Stress (if available)
        if (sensorInfo has :stress && sensorInfo.stress != null) {
            stress = sensorInfo.stress;
        } else {
            stress = 0;
        }

        // Send the data to the REST API
        var params = {
            "heartRate" => hR.toNumber(),
            "xAccel" => xAccel.toNumber(),
            "yAccel" => yAccel.toNumber(),
            "altitude" => altitude.toFloat(),
            "heading" => heading.toFloat(),
            "xMag" => xMag.toNumber(),
            "yMag" => yMag.toNumber(),
            "zMag" => zMag.toNumber(),
            "pressure" => pressure.toFloat(),
            "temp" => temp.toNumber(),
            "stress" => stress.toNumber()
        };
        var headers = {
            "Content-Type" => Communications.REQUEST_CONTENT_TYPE_JSON
        };
        var options = {
            :headers => headers,
            :method => Communications.HTTP_REQUEST_METHOD_POST,
            :responseType => Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON
        };

        Communications.makeWebRequest(url, params, options, method(:onReceive));
    }

    function onReceive(responseCode, data) {
        if (responseCode == 200) {
            System.println("Request Successful"); // Print success
        } else {
            System.println("Response: " + responseCode); // Print response code
        }
    }

   // Load resources here
    function onLayout(dc) {
        setLayout(Rez.Layouts.MainLayout(dc));
    }

    function onShow() as Void {
    }

    function onHide() as Void {
    }

    // Update the view
    function onUpdate(dc) {
        View.onUpdate(dc);
    }
}
