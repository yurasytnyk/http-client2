import axios from 'axios';

import { HttpClient } from './http-client/http-client';
import { FetchHttpClient } from './fetch-http-client/fetch-http-client';

const fetchClient = new FetchHttpClient();
const httpClient = new HttpClient(axios);

httpClient
  .setCustomHeaders({ 'Content-Type': 'application/json' })
  .post('https://jsonplaceholder.typicode.com/posts')
  .then((res) => console.log(res));
