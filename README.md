# CloudFlare Pages Shopify App Template

## What is this?
A Shopify app starter, built on top of CloudFlare pages.

## Why would I use this?
Because hosting a Shopify app on a regular node stack requires maintaining infrastructure, and infrastructure maintenance isn't always a game we like to play.

Also, this basically lets you get started quickly and efficiently.

## How do I get started?
First, create a new Shopify App. Note down the app's api key and secret.
Add `http://localhost:8788/oauth/callback` to the list of authorized callbacks, along with any other ones relevant to your use case.

Next, copy `.env.example` to `.env`, changing values for the appropriate ones.

Run `yarn && yarn start`, and off you go. 

To deploy, link your repository in GitHub pages and don't forget to add in your environment variables, similarly to your .env file :-)