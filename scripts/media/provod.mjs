#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const BASE_URL = process.env.PROVOD_BASE_URL ?? 'https://api.provod.ai/v1';
const API_KEY = process.env.PROVOD_API_KEY;

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    model: { type: 'string' },
    prompt: { type: 'string' },
    out: { type: 'string' },
    aspect: { type: 'string' },
    size: { type: 'string' },
    quality: { type: 'string' },
    resolution: { type: 'string' },
    n: { type: 'string' },
    format: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
});

const command = positionals[0] ?? 'help';

function requireKey() {
  if (!API_KEY) {
    console.error('Не задан PROVOD_API_KEY. Скопируйте .env.example в .env и вставьте ключ.');
    process.exit(1);
  }
}

async function api(path, init = {}) {
  requireKey();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return response.json();
}

async function listModels() {
  const payload = await api('/images/models');
  const models = payload.data ?? [];

  console.log(`Доступно моделей изображений: ${models.length}`);

  for (const model of models) {
    const kinds = [
      model.capabilities?.generation ? 'generation' : null,
      model.capabilities?.edit ? 'edit' : null,
      model.capabilities?.mask ? 'mask' : null,
    ]
      .filter(Boolean)
      .join(', ');

    console.log(`- ${model.id} | ${model.available ? 'available' : 'unavailable'} | ${kinds}`);
  }
}

async function generateImage() {
  const { model, prompt, out } = values;

  if (!model || !prompt || !out) {
    throw new Error('Укажите --model, --prompt и --out.');
  }

  const body = { model, prompt, response_format: 'b64_json' };

  if (values.aspect) body.aspect_ratio = values.aspect;
  if (values.size) body.size = values.size;
  if (values.quality) body.quality = values.quality;
  if (values.resolution) body.resolution = values.resolution;
  if (values.n) body.n = Number(values.n);
  if (values.format) body.output_format = values.format;

  const payload = await api('/images/generations', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const item = payload.data?.[0];

  if (!item) {
    throw new Error('Ответ без data[0].');
  }

  const target = resolve(out);
  await mkdir(dirname(target), { recursive: true });

  if (item.b64_json) {
    await writeFile(target, Buffer.from(item.b64_json, 'base64'));
  } else if (item.url) {
    const downloaded = await fetch(item.url);

    if (!downloaded.ok) {
      throw new Error(`Не удалось скачать результат: ${downloaded.status}`);
    }

    await writeFile(target, Buffer.from(await downloaded.arrayBuffer()));
  } else {
    throw new Error('В ответе нет ни b64_json, ни url.');
  }

  console.log(`Сохранено: ${target}`);
}

function printHelp() {
  console.log(`provod media

Команды:
  models
  image --model <id> --prompt "<text>" --out <path> [--aspect 1:1] [--size 1024x1024] [--quality medium] [--resolution 1K] [--n 1] [--format png]

Примеры:
  npm run media -- models
  npm run media -- image --model google/gemini-3.1-flash-image --prompt "moody cartoon fantasy hero" --out src/assets/sprites/characters/hero/idle.png --aspect 1:1

Видео (/v1/videos) пока не реализовано: схема асинхронных задач не подтверждена публичной документацией.`);
}

try {
  if (command === 'models') {
    await listModels();
  } else if (command === 'image') {
    await generateImage();
  } else {
    printHelp();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
