To deploy this application to Netlify, follow these steps:

1.  **Connect to Git Provider**: Log in to Netlify and connect your Git repository (GitHub, GitLab, Bitbucket).
2.  **Choose Repository**: Select the repository containing your PlayShotGen project.
3.  **Configure Build Settings**: Netlify should automatically detect your `netlify.toml` file. If not, configure the following:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
4.  **Deploy Site**: Click "Deploy site".

Netlify will then build and deploy your application. The `netlify.toml` file handles the build command and publish directory, and the `public/_redirects` file ensures proper routing, including the 404 page.