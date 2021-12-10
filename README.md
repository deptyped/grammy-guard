# The Hitchhiker's Guide to grammY Plugins

grammY is very extensible and it supports installing plugins. This repository is a template for developing such plugins.

⚠️ **For instructions on how to use this template please visit [official docs](https://grammy.dev/plugins/guide.html).**

# Rules of Contribution

Before diving into some hands-on examples, there are some notes to pay attention to if you would like your plugins to be submitted to the documentation:

1. You should document your plugin (README with instructions).
2. Explain the purpose of your plugin and how to use it by adding a page to the [docs](https://github.com/grammyjs/website).
3. Choose a permissive license such as MIT or ISC.

Finally, you should know that even though grammY supports both node and [deno](https://deno.land/), it is a Deno-first project and we also encourage you to write your plugins for Deno (and subsequently in style!).
There is a handy-dandy tool called [deno2node](https://github.com/wojpawlik/deno2node) that transpiles your code from deno to node so we can support both platforms.
This is **NOT** a must, however, it is very much encouraged.
