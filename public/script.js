// # Splash

const Splash = document.querySelector(".Splash");
let duration = 1000;

function removeSplash(){
    Splash.classList.add("remove-splash");
}

setTimeout(()=>{
    removeSplash();
},duration);

// # AWFA

const input = document.querySelector('input'); 
const audioElem = document.querySelector('audio');

// canvas
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

input.addEventListener('change', () => {

    // input can accept multiple file, so it stores in an array format.
    const file = input.files[0];  // storing first element of the array in file.
 
    if(!file) return;            // if the file is not an audio

    audioElem.src = URL.createObjectURL(file);
    audioElem.play();           

    // # Audio processing

    // create an audio context. 
    // Audio context processing graph or simple modular Routing.
    const audioContext = new AudioContext();

    // Accept the file from source node
    const audioSource = audioContext.createMediaElementSource(audioElem);

    // create an Analyser Node
    const analyser = audioContext.createAnalyser();

    // connecting audio-source-Node with analyser-node
    audioSource.connect(analyser);

    // Destination Node =>  Hardware speaker
    // connecting analyserNode with DestinationNode
    analyser.connect(audioContext.destination); 

    // fftsize => Determines No.of frequency bars * 2 
    // fftsize => 2 * Original frequency

    analyser.fftSize = 256; // Assume

    // Determines how may actual sound bars => fftsize/2;
    const bufferDataLength = analyser.frequencyBinCount;

    // bufferDataArray => Determines peak height of each bar
    // U-int-8 => Unsigned integer of 8 bits // positive numbers
    // 8 bits => 1byte => 2^8 = 256 => 0 to 255 indices
    const bufferDataArray = new Uint8Array(bufferDataLength);
    
    // Reading the bufferDataArray when played
    /*
    setInterval(() => {
        analyser.getByteFrequencyData(bufferDataArray);
        console.log(bufferDataArray);
    },500);
    */ 

    // Now draw & animate the result of the bufferDataArray

    // Determines the width of each bar
    const barWidth = (canvas.width / bufferDataLength);

    let x = 0; // starting point in x-axis

    function drawAndAnimateSoundBars() {
        // for every new  graph
        x = 0;
        canvasContext.clearRect(0,0,canvas.width,canvas.height);

        analyser.getByteFrequencyData(bufferDataArray);
        
        bufferDataArray.forEach((dataValue) => {
            // determines height of each bar
            const barHeight = dataValue;

            let red = Math.floor(Math.random() * 30 * barHeight) ;
            let blue = Math.floor(Math.random() * 30 * barWidth) ;
            let green = Math.floor(Math.random() * 30 * barWidth);

            // draw canvas
            canvasContext.fillStyle = `rgb(${red},${blue},${green})`;
            canvasContext.fillRect(x,canvas.height-barHeight, barWidth,barHeight);
            x = x + barWidth;

        })

        // recursively calling animation
        requestAnimationFrame(drawAndAnimateSoundBars);
    }
    drawAndAnimateSoundBars();
})