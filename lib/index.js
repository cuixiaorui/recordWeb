let leftChannelList = [];
let rightChannelList = [];
let microphone = null;
let audioCtx = null;
let audioStream = null;
let audioSourceNode = null;
let audioScriptProcessor = null;
function start() {
  if (navigator.mediaDevices) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function(mediaStream) {
        audioStream = mediaStream;
        microphone = getMicrophone();
        audioCtx = new AudioContext();
        // 基于 webrtcStream 创建 AudioNode
        audioSourceNode = audioCtx.createMediaStreamSource(audioStream);
        // 创建 scriptProcessor node 操作流数据
        audioScriptProcessor = audioCtx.createScriptProcessor();
        audioScriptProcessor.onaudioprocess = onaudioprocessHandler;
        // 必须连接到出口节点
        audioScriptProcessor.connect(audioCtx.destination);
        // 源数据连接 scriptProcessor 用以操作数据
        audioSourceNode.connect(audioScriptProcessor);
      })
      .catch(function(err) {
        console.log("The following gUM error occured: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
}

function onaudioprocessHandler(e) {
  let audioBuffer = e.inputBuffer;
  let leftChannels = audioBuffer.getChannelData(0);
  leftChannelList.push(...leftChannels);
  let rightChannels = audioBuffer.getChannelData(1);
  rightChannelList.push(...rightChannels);
}

function getMicrophone() {
  let audioTracks = audioStream.getAudioTracks();
  let normalAudioTrack = audioTracks && audioTracks[0];
  return normalAudioTrack;
}

function stop() {
  microphone.stop();
  audioSourceNode.disconnect();
  audioScriptProcessor.disconnect();
  let wav = new Wav(
    toFloat32Array(leftChannelList),
    toFloat32Array(rightChannelList)
  );

  this.playRecord(wav.buffer);
}
function playRecord(arrayBuffer) {
  let blob = new Blob([new Uint8Array(arrayBuffer)]);
  let blobUrl = URL.createObjectURL(blob);
  document.querySelector(".audio-node").src = blobUrl;
}

function toFloat32Array(array) {
  let tempArray = Float32Array.from(array);
  return tempArray;
}
