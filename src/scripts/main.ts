import axios from 'axios';
import { HttpClient } from './http-client/http-client';
import { FetchHttpClient } from './fetch-http-client/fetch-http-client';

const fetchClient = new FetchHttpClient();
const httpClient = new HttpClient('https://jsonplaceholder.typicode.com/', fetchClient);

httpClient
  .setCustomHeaders({ 'Content-Type': 'application/json' })
  .post('posts', {
    body: { name: 'shf' },
  })
  .then((res) => console.log(res));
