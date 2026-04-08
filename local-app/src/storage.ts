import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { SessionPayload, TopicPayload } from './providers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const stateFile = path.join(dataDir, 'state.json');

export interface LocalAppState {
  topics: TopicPayload[];
  sessions: SessionPayload[];
}

const defaultState: LocalAppState = {
  topics: [],
  sessions: [],
};

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(stateFile);
  } catch {
    await fs.writeFile(stateFile, JSON.stringify(defaultState, null, 2), 'utf-8');
  }
}

export async function readStateFile(): Promise<LocalAppState> {
  await ensureDataFile();
  const raw = await fs.readFile(stateFile, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as LocalAppState;
    return {
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return defaultState;
  }
}

export async function writeStateFile(state: LocalAppState): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf-8');
}
