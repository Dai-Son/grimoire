import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../i18n', () => ({ default: { t: (key: string) => key } }));
vi.mock('../stores/toastStore', () => ({ showToast: vi.fn() }));

import { deleteReplacedMod } from './api';

const entry = { id: 'a', size: 1, installedAt: '2026-01-01T00:00:00Z' };

function stubDelete(skipped: string[]) {
  const deleteMod = vi.fn(async () => ({ skipped }));
  vi.stubGlobal('window', { electronAPI: { deleteMod } });
  return deleteMod;
}

afterEach(() => vi.unstubAllGlobals());

describe('deleteReplacedMod', () => {
  it('resolves when the old file was deleted', async () => {
    const deleteMod = stubDelete([]);
    await expect(deleteReplacedMod(entry)).resolves.toBeUndefined();
    expect(deleteMod).toHaveBeenCalledWith(entry);
  });

  it('throws when the old file changed, so the update stops before restoring state', async () => {
    stubDelete(['a']);
    await expect(deleteReplacedMod(entry)).rejects.toThrow('installed.delete.replacedChanged');
  });
});
