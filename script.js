let xAxis = document.getElementById("x-axis");
let yAxis = document.getElementById("y-axis");
let zAxis = document.getElementById("z-axis");
let statusText = document.getElementById("status");

let isDetecting = false;
let threshold = 12; // Adjust sensitivity
let lastAlertTime = 0;
let alertCooldown = 5000; // Prevent spam alerts

// Start detection
document.getElementById("startBtn").addEventListener("click", () => {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", detectEarthquake);
        isDetecting = true;
        statusText.innerText = "Status: Monitoring...";
    } else {
        alert("Your device does not support motion sensors!");
    }
});

// Stop detection
document.getElementById("stopBtn").addEventListener("click", () => {
    window.removeEventListener("devicemotion", detectEarthquake);
    isDetecting = false;
    statusText.innerText = "Status: Stopped.";
});

// Detect Earthquake
function detectEarthquake(event) {
    if (!isDetecting) return;

    let acceleration = event.accelerationIncludingGravity;
    let x = acceleration.x.toFixed(2);
    let y = acceleration.y.toFixed(2);
    let z = acceleration.z.toFixed(2);

    xAxis.innerText = x;
    yAxis.innerText = y;
    zAxis.innerText = z;

    let magnitude = Math.sqrt(x * x + y * y + z * z).toFixed(2);

    if (magnitude > threshold) {
        let currentTime = new Date().getTime();
        if (currentTime - lastAlertTime > alertCooldown) {
            triggerAlert(magnitude);
            lastAlertTime = currentTime;
        }
    }
}

// Alert Function
function triggerAlert(magnitude) {
    statusText.innerHTML = `🚨 Possible Earthquake Detected! <br>Magnitude: ${magnitude}`;
    statusText.style.color = "red";
    
    let audio = new Audio("alert.mp3");
    audio.play();

    let speech = new SpeechSynthesisUtterance("Warning! Possible earthquake detected!");
    window.speechSynthesis.speak(speech);

    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = "#121212";
    }, 3000);
}
