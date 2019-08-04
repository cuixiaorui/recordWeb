const WAV_HEAD_SIZE = 44;
class Wav {
  constructor(leftChannelDataList, rightChannelDataList) {
    let channelDataList = this.mergeDataList(
      leftChannelDataList,
      rightChannelDataList
    );
    this._buffer = this.createBufferData(channelDataList);
  }
  get buffer() {
    return this._buffer;
  }

  mergeDataList(left, right) {
    let totalLength = left.length + right.length;
    let data = new Float32Array(totalLength);
    for (let i = 0; i < left.length; i++) {
      let k = i * 2;
      data[k] = left[i];
      data[k + 1] = right[i];
    }
    return data;
  }

  getBufferTotalLength(audioData) {
    return audioData.length * 2 + WAV_HEAD_SIZE;
  }

  createBufferData(audioData) {
    let buffer = new ArrayBuffer(this.getBufferTotalLength(audioData));
    // 需要用一个view来操控buffer
    let view = new DataView(buffer);
    this.writeHeadInfo(audioData, view);
    this.writePCMInfo(audioData, view);
    return buffer;
  }
  writeHeadInfo(audioData, view) {
    // 写入wav头部信息
    // RIFF chunk descriptor/identifier
    this.writeUTFBytes(view, 0, "RIFF");
    // RIFF chunk length
    view.setUint32(4, 44 + audioData.length * 2, true);
    // RIFF type
    this.writeUTFBytes(view, 8, "WAVE");
    // format chunk identifier
    // FMT sub-chunk
    this.writeUTFBytes(view, 12, "fmt ");
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    // sample rate
    view.setUint32(24, 44100, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, 44100 * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2 * 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data sub-chunk
    // data chunk identifier
    this.writeUTFBytes(view, 36, "data");
    // data chunk length
    view.setUint32(40, audioData.length * 2, true);
  }

  writePCMInfo(audioData, view) {
    let length = audioData.length;
    let index = WAV_HEAD_SIZE;
    let volume = 1;
    for (let i = 0; i < length; i++) {
      // 写入16位位深即用16位二进制表示声音的强弱，16位表示的范围是 [-32768, +32767]，最大值是32767即0x7FFF，录音数据的取值范围是[-1, 1]，表示相对比例，用这个比例乘以最大值就是实际要存储的值
      view.setInt16(index, audioData[i] * (0x7fff * volume), true);
      index += 2;
    }
  }

  writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
