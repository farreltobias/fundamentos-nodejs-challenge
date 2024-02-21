import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath)
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    return fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    const data = this.#database[table];

    if (!search) {
      return data;
    }

    return data.filter((row) => {
      return Object.entries(search).every(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase());
      });
    });
  }

  insert(table, data) {
    const now = new Date().toISOString();

    let dataToInsert = {
      ...data,
      id: randomUUID(),
      created_at: now,
      updated_at: now,
    };

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(dataToInsert);
    } else {
      this.#database[table] = [dataToInsert];
    }

    this.#persist();

    return dataToInsert;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((row) => row.id === id);

    if (index === -1) {
      return null;
    }

    const now = new Date().toISOString();

    this.#database[table][index] = {
      ...this.#database[table][index],
      ...data,
      id,
      updated_at: now,
    };

    this.#persist();

    return this.#database[table][index];
  }

  delete(table, id) {
    const index = this.#database[table].findIndex((row) => row.id === id);

    if (index === -1) {
      return null;
    }

    const [row] = this.#database[table].splice(index, 1);

    this.#persist();

    return row;
  }
}
