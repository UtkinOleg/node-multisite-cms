# Multi Site Lite Version 1.0

Multisite is Content Management System (CMS) based on NodeJS and Angular 9

**Demo CMS**
<https://node-multisite-api.herokuapp.com/>

**Demo site**
<https://node-multisite-demo.herokuapp.com/>

## Table of contents

- [What's included](#whats-included)
- [Installation](#installation)
- [Creator](#creator)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)

## What's included

**Backend API** 

NodeJS Application

- <https://github.com/UtkinOleg/node-multisite-cms/tree/master/multisite_api>

**CMS Administrator dashboard** 

Angular 9 Application

- <https://github.com/UtkinOleg/node-multisite-cms/tree/master/multisite_admin>

**Frontend site** 

NodeJS Application

- <https://github.com/UtkinOleg/node-multisite-cms/tree/master/multisite_site>

## Installation

- Install PostgreSQL Server

- Create database **site** and deploy scheme **scheme.sql**

- Setup postgres connection in file **\multisite_api\models\config.js**

- Setup api_url and site_data in file **multisite_site\models\config.js** 

- Rename folder **\multisite_admin\\_environments** to **\multisite_admin\environments** 

- Setup environment paths **\multisite_admin\environments** (api hostname and site hostname)

- Build **multisite_admin**

- Run node.js applications **multisite_api** and **multisite_site**

## Creator

**Oleg Utkin**

- <https://github.com/UtkinOleg>

## Thanks

If you have an idea or you want to do something, tell me or just do it! I'm always happy to hear
your feedback!

## Copyright and license

Code and documentation copyright 2020 the authors. Code released under the
[MIT License](https://github.com/UtkinOleg/node-multisite-cms/blob/master/LICENSE).
