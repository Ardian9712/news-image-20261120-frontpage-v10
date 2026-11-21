import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const REQUIRED_DIMENSION = 1024;
const SOF_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function jpegDimensions(bytes: Buffer, path: string): { width: number; height: number } {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error(`${path}: not a JPEG (missing start-of-image marker).`);
  }
  if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    throw new Error(`${path}: incomplete JPEG (missing end-of-image marker).`);
  }

  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error(`${path}: malformed JPEG marker at byte ${offset}.`);
    }
    while (offset < bytes.length && bytes[offset] === 0xff) offset++;
    if (offset >= bytes.length) {
      throw new Error(`${path}: truncated JPEG marker.`);
    }

    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;

    if (offset + 2 > bytes.length) {
      throw new Error(`${path}: truncated JPEG segment length.`);
    }
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) {
      throw new Error(`${path}: invalid JPEG segment length at byte ${offset}.`);
    }

    if (SOF_MARKERS.has(marker)) {
      if (segmentLength < 11) {
        throw new Error(`${path}: invalid JPEG frame header.`);
      }
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }
  throw new Error(`${path}: JPEG dimensions missing from the header.`);
}

function validateImage(bytes: Buffer, path: string): void {
  if (bytes.length > MAX_BYTES) {
    throw new Error(`${path}: ${bytes.length} bytes exceeds the ${MAX_BYTES}-byte limit.`);
  }
  const { width, height } = jpegDimensions(bytes, path);
  if (width !== REQUIRED_DIMENSION || height !== REQUIRED_DIMENSION) {
    throw new Error(`${path}: expected 1024x1024 pixels, found ${width}x${height}.`);
  }
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDirectory, "source-image.jpg");
const outputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const outputPath = join(outputDirectory, "entry.png");

const source = await readFile(sourcePath);
validateImage(source, sourcePath);
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, source);

const output = await readFile(outputPath);
validateImage(output, outputPath);
if (!output.equals(source)) {
  throw new Error(`${outputPath}: written bytes differ from source-image.jpg.`);
}

const sha256 = createHash("sha256").update(output).digest("hex");
console.log(`Success: ${outputPath} | ${output.length} bytes | SHA-256 ${sha256}`);
