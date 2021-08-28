<template>
  <div class="photo">
    <h1 class="title">上传照片</h1>
    <img v-show="ready && !ok" id="source" class="m-2" src="/img/placeholder.png">
    <canvas v-show="ok" id="preview" class="m-2" height="413" width="295"></canvas>
    <div v-if="msg" class="control is-loading" style="width: 300px;">
      <input class="input is-static" type="text" v-model="msg">
    </div>
    <div class="file">
      <label class="file-label" v-if="!msg">
        <input class="file-input" id="upload" type="file" @change="uploadImage" accept=".jpg, .jpeg, .png">
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-24px mdi-upload"></i>
          </span>
          <span class="file-label">
            选择图片
          </span>
        </span>
      </label>
      <button class="button is-primary ml-4" v-if="ok && !msg" @click="submit">
        <span class="file-icon">
          <i class="mdi mdi-24px mdi-check"></i>
        </span>
        提交图片
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import * as faceapi from 'face-api.js'
import axios from '../plugins/axios.js'
import { U, token } from '../plugins/state.js'

if (!U.value) router.push('/login')
const modelURL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/'
const STD = 173.3 // pixel length of face area

let msg = $ref('正在载入人脸检测模块...')
let ready = $ref(false)
let ok = $ref(false)

let source, canvas, ctx

async function init () {
  await faceapi.nets.ssdMobilenetv1.loadFromUri(modelURL)
  msg = ''
  ready = true
  source = document.getElementById('source')
  canvas = document.getElementById('preview')
  ctx = canvas.getContext('2d')
}
init()

async function uploadImage () {
  msg = '正在分析人脸与图片尺寸...'
  ok = false
  const imgFile = document.getElementById('upload').files[0]
  const img = await faceapi.bufferToImage(imgFile)
  source.src = img.src
  const d = await faceapi.detectSingleFace(img)
  console.log(d)
  if (!d) {
    Swal.fire('人脸识别失败', '请重新选择图片', 'error')
    msg = ''
    source.src = '/img/placeholder.png'
    return
  }
  const b = d.box
  const s = (b.width + b.height) / (2 * STD)
  const cx = b.x + b.width/2
  const cy = b.y + b.height/2
  const c = {
    l: cx - 295*s/2,
    t: cy - 413*s/2.33 < 0 ? cy - 413*s/2.40 : cy - 413*s/2.33,
    w: 295*s, h: 413*s
  }
  if (c.l < 0 || c.t < 0 || c.l + c.w > d.imageWidth || c.t + c.h > d.imageHeight) {
    Swal.fire('无法截取标准尺寸', '人脸过于靠近边界，请重新选择图片', 'error')
    msg = ''
    source.src = '/img/placeholder.png'
    return
  }
  msg = '自动剪裁中...'
  ctx.drawImage(img, c.l, c.t, c.w, c.h, 0, 0, 295, 413)
  ok = true
  msg = ''
}

function toBlob (data) {
  const byteString = atob(data.split(',')[1])
  const mimeString = data.split(',')[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

async function submit () {
  const data = canvas.toDataURL('image/png')
  function catchErr (e) {
    Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
    return false
  }
  msg = '正在提交，请耐心等待...'
  const url = await axios.post('/store/photo', {}, token())
    .then(({ data }) => data)
    .catch(catchErr)
  if (!url) return
  try {
    await axios.put(url, toBlob(data), { headers: { 'Content-Type': 'image/png' } })
    Swal.fire('成功', '照片上传成功', 'success')
      .then(() => { router.push('/') })
  } catch (e) {
    Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
    msg = ''
  }
}
</script>

<style scoped>
div.photo {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
img#source {
  max-width: 295px;
}
</style>