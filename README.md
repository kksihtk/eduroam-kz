# eduroam Kazakhstan

React + Vite website for the KazRENA eduroam Kazakhstan service.

## Requirements

- Node.js 20 or newer
- npm
- Nginx for production hosting

## Local Development

```bash
npm install
npm run dev
```

By default, Vite starts the local server at `http://localhost:5173/`.

## Production Build

```bash
npm install
npm run build
```

The generated static files will be placed in `dist/`.

## Deploying With Nginx

1. Build the project:

```bash
npm run build
```

2. Copy the contents of `dist/` to your web root, for example:

```bash
sudo mkdir -p /var/www/eduroam-kz
sudo cp -r dist/* /var/www/eduroam-kz/
```

3. Create an Nginx server block:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/eduroam-kz;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

4. Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/eduroam-kz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

The `try_files $uri $uri/ /index.html;` rule is required because this is a single-page application. It allows routes such as `/ru/legal/`, `/kz/organizations/`, and `/en/` to work after a direct page refresh.

## License

This project is distributed under the license in [LICENSE](LICENSE).

The license text must remain available on the `/legal` page or in a website section that serves an equivalent function. The developer website is `https://shop.kksihtkk.dev`, and the canonical license page is `https://shop.kksihtkk.dev/legal#license`.
