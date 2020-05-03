import { register } from 'register-service-worker';
import utils from '@/utils';

if (utils.isProd()) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(serviceWorkerRegistration) {
      const delimiter = () => window.console.log(
        '%c<================================>',
        'color:#009688;font-weight:900;font-size:40px',
      );
      delimiter();
      window.console.log(
        '%cApp is being served from cache by a service worker.\n'
        + '%cFor more details, visit https://goo.gl/AFskqB',
        'color:#000;font-weight:900;font-size:20px',
        'color:#2196F3;font-weight:400;font-size:15px',
      );
      window.console.table(serviceWorkerRegistration);
      delimiter();
    },

    error(error) {
      window.console.error('fetch service worker failed => ', error);
    },
  });
}
