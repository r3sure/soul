const modules = import.meta.glob(
  './sprites/**/*.{png,webp,avif,gif,svg,jpg,jpeg,webm,mp4}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>;

function toSpriteId(path: string): string {
  return path.replace(/^\.\/sprites\//, '').replace(/\.[^.]+$/, '');
}

const spriteUrls = new Map<string, string>(
  Object.entries(modules).map(([path, url]) => [toSpriteId(path), url]),
);

export function getSpriteUrl(spriteId: string): string | undefined {
  return spriteUrls.get(spriteId);
}

export function hasSprite(spriteId: string): boolean {
  return spriteUrls.has(spriteId);
}

export function isVideoUrl(url: string): boolean {
  return url.startsWith('data:video/') || /\.(webm|mp4)(\?.*)?$/i.test(url);
}

export function listSpriteIds(): string[] {
  return [...spriteUrls.keys()].sort();
}
