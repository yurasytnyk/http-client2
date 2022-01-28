import axios from 'axios';
import { HttpClient } from './http-client/http-client';
import { FetchHttpClient } from './fetch-http-client/fetch-http-client';
import { unregister } from './utils/fetch-interceptors/fetch-interceptors';

const fetchClient = new FetchHttpClient();
const httpClient = new HttpClient('https://jsonplaceholder.typicode.com/', fetchClient);

httpClient
  .setCustomHeaders({ 'Content-Type': 'application/json' })
  .post('posts', {
    body: { name: 'shf' },
  })
  .then((res) => res);

const btn = document.getElementById('btn');

const update = () => {
  httpClient
      .setCustomHeaders({ 'Content-Type': 'application/json' })
      .post('posts', {
        body: { name: 'shf' },
      })
      .then((res) => {
        console.log(res);
        fetchClient.getController.abort();
      });
};

btn.addEventListener('click', update);

unregister();

fetch('https://jsonplaceholder.typicode.com/posts', {
  headers: {
    'Content-Type': 'application/json',
  },
}).then(res => console.log(res));
