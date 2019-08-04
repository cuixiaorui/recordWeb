// 参考
// https://juejin.im/post/5b8bf7e3e51d4538c210c6b0
// 输入 - 处理 - 输出
// 1. 如何获取用户对这麦克风说话得数据
// 通过 webrtc -> navigator.mediaDevices()
// 2. 如何把录制过程得所有声音数据都记录下来
// audioContext -> ScriptProcessorNode 使用 js 操作 audio
// 3. 如何把记录下来得数据转化为可播放得声音格式
// wav -> 查阅 wav 格式文档  二进制数据 —> .wav
// 4. 如何播放 wav 文档流
// 使用 URL.createObjectURL(blob) 生成 audio 可播放得 url 地址
// 5. 如何生成所需得 blob
// new Blob([new Int8Array(this.result)]);

// 1. 检测是否支持录音（是否有 navigator.mediaDevices 函数 )

// 2. 开始录音（ 创建 mediaStream ）

// 3. 开始录音失败 （创建失败的话 返回错误信息 （是否加工给出明确的信息提示））
// 返回一个失败状态的Promise，这个Promise失败后的回调函数带一个DOMException对象作为其参数。 可能的异常有：
// AbortError［中止错误］
// 尽管用户和操作系统都授予了访问设备硬件的权利，而且未出现可能抛出NotReadableError异常的硬件问题，但仍然有一些问题的出现导致了设备无法被使用。
// NotAllowedError［拒绝错误］
// 用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。
// 较旧版本的规范使用了SecurityError，但在新版本当中SecurityError被赋予了新的意义。
// NotFoundError［找不到错误］
// 找不到满足请求参数的媒体类型。
// NotReadableError［无法读取错误］
// 尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
// OverConstrainedError［无法满足要求错误］
// 指定的要求无法被设备满足，此异常是一个类型为OverconstrainedError的对象，拥有一个constraint属性，这个属性包含了当前无法被满足的constraint对象，还拥有一个message属性，包含了阅读友好的字符串用来说明情况。
// 因为这个异常甚至可以在用户尚未授权使用当前设备的情况下抛出，所以应当可以当作一个探测设备能力属性的手段［fingerprinting surface］。
// SecurityError［安全错误］
// 在getUserMedia() 被调用的 Document 上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。
// TypeError［类型错误］
// constraints对象未设置［空］，或者都被设置为false。

// 4.
