import { Doc } from "./database-docs/doc";

export interface DBStorableStatic<T extends Doc, U> {
    fromDoc(doc: T): U;
}

export interface DBStorable<T extends Doc> {
    toDoc(): T;
    // fromDoc(doc: T): this;
}