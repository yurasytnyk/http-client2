import axios from 'axios';

import { HttpClient } from './http-client/http-client';
import { FetchHttpClient } from './fetch-http-client/fetch-http-client';

const fetchClient = new FetchHttpClient({
  headers: { 'Content-Type': 'application/json' },
});
const httpClient = new HttpClient(fetchClient);

httpClient
  .setCustomHeaders({ 'Content-Type': 'application/json' })
  .post('https://jsonplaceholder.typicode.com/posts', {
    body: { name: 'shf' },
  })
  .then((res) => console.log(res));
