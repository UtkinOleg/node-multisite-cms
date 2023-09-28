# Multi Site Lite Version 1.0.1

Multisite is Content Management System (CMS) based on NodeJS and Angular

**Demo CMS**
<https://multisite-api.onrender.com/>

**Demo site**
<https://multisite-89ri.onrender.com/>

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

Angular Application

- <https://github.com/UtkinOleg/node-multisite-cms/tree/master/multisite_admin>

**Frontend site** 

NodeJS Application

- <https://github.com/UtkinOleg/node-multisite-cms/tree/master/multisite_site>

## Installation

- Install PostgreSQL on your server or if you use Amazon RDS for PostgreSQL create database **site** and deploy scheme file **scheme.sql**

- Setup postgres connection in file **\multisite_api\models\config.js** , api_url and site_data (title, description and etc) in file **multisite_site\models\config.js** 

- Setup CMS Dashboard - rename folder **\multisite_admin\\_environments** to **\multisite_admin\environments** and setup environment paths **\multisite_admin\environments** (api hostname and site hostname)

- Build CMS Dashboard in production **multisite_admin**

- Run node.js applications **multisite_api** and **multisite_site** on your platform

## Creator

**Oleg Utkin**

- <https://github.com/UtkinOleg>

## Thanks

If you have an idea or you want to do something, tell me or just do it! I'm always happy to hear
your feedback!

## Copyright and license

Code and documentation copyright 2020 the authors. Code released under the
[MIT License](https://github.com/UtkinOleg/node-multisite-cms/blob/master/LICENSE).
