import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';
import http from 'node:http';

const csvPaths = new URL('./tasks.csv', import.meta.url);

const stream = createReadStream(csvPaths);

const parser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
});

const execute = async () => {
  const lines = stream.pipe(parser);

  for await (const line of lines) {
    const [title, description] = line;

    console.log({ title, description });

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
  }
};

execute();
