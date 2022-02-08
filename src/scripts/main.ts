import axios from 'axios';
import { HttpClient } from './http-client/http-client';
import { FetchHttpClient } from './fetch-http-client/fetch-http-client';

const fetchClient = new FetchHttpClient();
const httpClient = new HttpClient('https://jsonplaceholder.typicode.com/', axios);

httpClient
  .setCustomHeaders({ 'Content-Type': 'application/json' })
  .post('posts', {
    body: { name: 'hello world' },
  })
  .then((res) => console.log(res));

// const btn = document.getElementById('btn'); // <-- abort controller demonstration

// const update = () => {
//   httpClient
//       .setCustomHeaders({ 'Content-Type': 'application/json' })
//       .post('posts', {
//         body: { name: 'shf' },
//       })
//       .then((res) => {
//         console.log(res);
//         fetchClient.getController.abort();
//       });
// };

// btn.addEventListener('click', update);
