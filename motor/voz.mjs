// Transcripción local de notas de voz de Telegram con Whisper (sin servicios externos).
// El modelo se descarga una sola vez de Hugging Face a ./modelos y después funciona sin internet.

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const MODEL = 'onnx-community/whisper-small'
let asrPromise = null

async function getAsr(log) {
  if (!asrPromise) {
    asrPromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.cacheDir = join(ROOT, 'modelos')
      log?.('Cargando Whisper (la primera vez descarga ~250 MB)…')
      const asr = await pipeline('automatic-speech-recognition', MODEL, { dtype: 'q8' })
      log?.('Whisper listo')
      return asr
    })().catch(e => { asrPromise = null; throw e })
  }
  return asrPromise
}

// Telegram manda las notas de voz en OGG/Opus a 48 kHz; Whisper necesita PCM mono a 16 kHz
async function decodeOgg(bytes) {
  const { OggOpusDecoder } = await import('ogg-opus-decoder')
  const decoder = new OggOpusDecoder()
  await decoder.ready
  try {
    const { channelData, sampleRate } = await decoder.decodeFile(bytes)
    const mono = channelData.length > 1
      ? channelData[0].map((v, i) => (v + channelData[1][i]) / 2)
      : channelData[0]
    return resample(mono, sampleRate, 16000)
  } finally {
    decoder.free()
  }
}

function resample(data, from, to) {
  if (from === to) return data
  const ratio = from / to
  const out = new Float32Array(Math.floor(data.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const pos = i * ratio, i0 = Math.floor(pos), f = pos - i0
    out[i] = data[i0] * (1 - f) + (data[i0 + 1] ?? data[i0]) * f
  }
  return out
}

export async function transcribe(bytes, log) {
  const [asr, audio] = await Promise.all([getAsr(log), decodeOgg(bytes)])
  const res = await asr(audio, { language: 'spanish', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 })
  return (res?.text || '').trim()
}

// Precarga opcional para que la primera nota de voz no espere la descarga
export function warmUp(log) {
  getAsr(log).catch(e => log?.('No pude cargar Whisper: ' + e.message))
}
