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

## I'm more of a visual, can we build something together?
Sure can! Follow along!

### Part 1 - Getting started
https://www.loom.com/share/0730258114a44f02b7312a20c8731a46


### Part 2 - Building the UI
https://www.loom.com/share/7c3dba51e09548da8459b22c3c6186ec

### Part 3 - Handling uploads, data and errors
https://www.loom.com/share/e67c15b69607437e86318cfd97b1e732
