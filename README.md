# google-marker-clusterer-spike

## Github Pages Build

Prerequisites:

- [rbenv](https://github.com/rbenv/rbenv)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

See [https://pages.github.com/versions/](https://pages.github.com/versions/) for the required github pages Ruby version & use [`rbenv`](https://github.com/rbenv/rbenv#installation) to manage Ruby versions locally.

To upgrade github pages plugin dependencies, run `bundle update github-pages`.

Run `make` to install dependencies

<!-- ## Local dev

Prerequisites: [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Run `make` to install dependencies

Run `make local` to serve `index.html` -->

## Utils

Copy of `.env.example` to `.env` and update the env variables.

Run `make refresh-data` to update the locations file in `./data`. This will use the latest data from the specified Google Sheet to update the
