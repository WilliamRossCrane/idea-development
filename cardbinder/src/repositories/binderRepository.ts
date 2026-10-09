// The ONLY place that touches browser storage. Components use the store (src/features/store.tsx), which talks to this interface.
// To move to Supabase: implement BinderRepository against it and swap the instance in the store provider.
import { deserialise, serialise, type Binder, type CollectionItem, type Store } from "@/features/binders/logic";

export class RepositoryError extends Error {
  constructor(public code: "storage" | "corrupt", message: string) { super(message); }
}
export interface BinderRepository {
  getBinders(): Promise<Binder[]>;
  getBinder(id: string): Promise<Binder | null>;
  createBinder(b: Binder): Promise<void>;
  updateBinder(b: Binder): Promise<void>;
  deleteBinder(id: string): Promise<void>;
  getItems(): Promise<CollectionItem[]>;
  saveItem(i: CollectionItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

const KEY = "cardbinder:v1";
export class LocalBinderRepository implements BinderRepository {
  private read(): Store {
    let raw: string | null;
    try { raw = localStorage.getItem(KEY); } catch { throw new RepositoryError("storage", "Browser storage is unavailable."); }
    try { return deserialise(raw); } catch { throw new RepositoryError("corrupt", "Your saved data couldn't be read, so nothing was changed."); }
  }
  private write(s: Store) {
    try { localStorage.setItem(KEY, serialise(s)); } catch { throw new RepositoryError("storage", "Couldn't save. Browser storage is full or blocked."); }
  }
  async getBinders() { return this.read().binders; }
  async getBinder(id: string) { return this.read().binders.find(b => b.id === id) ?? null; }
  async createBinder(b: Binder) { const s = this.read(); this.write({ ...s, binders: [...s.binders.filter(x => x.id !== b.id), b] }); }
  async updateBinder(b: Binder) { const s = this.read(); this.write({ ...s, binders: s.binders.map(x => (x.id === b.id ? b : x)) }); }
  async deleteBinder(id: string) { const s = this.read(); this.write({ ...s, binders: s.binders.filter(x => x.id !== id) }); }
  async getItems() { return Object.values(this.read().items); }
  async saveItem(i: CollectionItem) { const s = this.read(); this.write({ ...s, items: { ...s.items, [i.id]: i } }); }
  async deleteItem(id: string) { const s = this.read(); const { [id]: _gone, ...items } = s.items; this.write({ ...s, items }); }
}
