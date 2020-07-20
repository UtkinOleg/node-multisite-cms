import { Injectable } from '@angular/core';

export interface Param {
  name: string;
  value: string;
}

@Injectable()
export class Options {
  public content: any;
  public dateM: any;

	constructor() {
		this.content = {
      title: '',
      description: '',
      crumb: '',
      crumburl: '',
      header: '',
      footer: '',
      main_header: '',
      main_footer: '',
      css: ''
    }
  }
}

@Injectable()
export class Document {
  public content: any;
  public name: string;
  public url: string;
  public published: boolean;

	constructor() {
    this.name = '';
    this.url = '';
    this.published = false;
    this.content = {
      seo_title: '',
      seo_description: '',
      breadcrumbs: [],
      text: '',
      picture: '',
      content: []
    }
  }
}

