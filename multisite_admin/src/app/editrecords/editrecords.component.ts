import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { RecordsService } from './../app.service';
import { confirmDialog } from '../dialog-confirm/dialog-confirm';
import { CssSelector } from '@angular/compiler';

export interface category {
  type: string;
  name: string;
}

export interface Param {
  name: string;
  value: string;
}

@Component({
  selector: 'app-editrecords',
  templateUrl: './editrecords.component.html',
  styleUrls: ['./editrecords.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]  
})
export class EditrecordsComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  dataOptions = [];
  columnsToDisplay = ['name', 'api', 'date', 'date2', 'edit', 'copy', 'preview', 'published', 'delete'];
  expandedElement: any | null;
  selectedElement: any | null;
  errorMessage: string;
  openEditor: boolean = false;
  jsonEditor: boolean = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  options: any = {
    content: {
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
  };

  document: any = { 
    name: '', 
    url: '',
    published: false, 
    content: {
      seo_title: '',
      seo_description: '',
      breadcrumbs: [],
      text: '',
      picture: '',
      content: []
    }
  };

  docJson: any = { 
    name: '', 
    url: '', 
    content: null
  };
  
  urlResponse: any;
  form: FormGroup;
  formOptions: FormGroup;
  formContent: any[];

  formQuestionsContent: any[];
  formQuestionsContentItems: any[];
  formQuestionsOptions: any[];
  formQuestionsOptionsItems: any[];

  config: any = {
    height: '200px'
  };  
  params: Param[];
  breadcrumbs: Param[];
  firstURL: string;
  firstURLParams: Param[];
  firstURLHeaderParams: Param[];
  secondURL: string;
  secondURLParams: Param[];
  secondURLHeaderParams: Param[];
  paramUrlValue = new FormControl();
  headerParameter = new FormControl();
  headerParamValue = new FormControl();
  showMore: boolean = false;
  helps: string;
  moreHelp: string;
  sub: any;
  type: string;
  newDocument: boolean = false;
  showProgress: boolean = false;
  selectable = true;
  filterValue: string;
  selectedZone: number;
  selectedPage: any;
  
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.form.get('html').value);
  }

  constructor(private _router: Router, 
    public titleHTML: Title,
    public snackBar: MatSnackBar, 
    public _records: RecordsService,
    public urlDialog: MatDialog,
    public confirmDialog: MatDialog,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer) { 
      this.form = new FormGroup({
        html: new FormControl()
      })
      this.formOptions = new FormGroup({
        header: new FormControl(),
        footer: new FormControl(),
        main_header: new FormControl(),
        main_footer: new FormControl()
      })
    }

  ngOnInit() {
    this.initApp()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  help(index: number): void {
    this.helps = this._records.messages[index];
    this.moreHelp = this._records.messagesMore[index];
  }

  initApp() : void {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
      this.openEditor = false;
      this.jsonEditor = false;
      this.titleHTML.setTitle(this._records.title + ' - ' + this.type);
      this.reloadData()
    })
  }  

  openSnackBar(arr: any, param?: string) {
    let message = arr[0] + (param ? param : '') + arr[1];
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }

  getColor(element: any): string {
    return element.content.selected_zone ? 'warn' : (element.content.breadcrumbs.length === 0 ? 'accent' : 'primary')
  }

  addDocument() {
    this.newDocument = true;
    this.openEditor = true;
    this.document.name = '';
    this.document.url = '';
    this.document.content.seo_title = '';
    this.document.content.seo_description = '';
    this.document.content.breadcrumbs = [];
    this.document.content.text = '';
    this.document.content.content = [];
    this.formContent = [];
    this.formQuestionsContent = [];
    this.formQuestionsContentItems = [];
    this.form.get('html').setValue(this.document.content.text);
  }

  addJson() {
    this.jsonEditor = true;
    this.docJson.name = '';
    this.docJson.url = '';
  }

  reloadData() {
    this.showProgress = true;
    this.dataSource = new MatTableDataSource([]);
    this._records.getDocuments(this.type).subscribe(
      data => {
        data.map(d => {
          d.dateC = format(new Date(d.date_create), 'dd-MM-yyyy HH:mm'); 
          d.dateM = d.date_modify ? format(new Date(d.date_modify), 'dd-MM-yyyy HH:mm') : ''; 
          this.dataSource.data.push(d) 
        });
        this.dataSource.sort = this.sort;
        this.urlResponse = null;
        this.showProgress = false;
        this.setFilter()
      },
      error =>  {
        this.showProgress = false;
        this.snackBar.open('Connection error', '', {
          duration: 2000,
        });
        this.errorMessage = <any>error
      });

      this._records.getOptions(this.type).subscribe(
        data => {
          data.map(d => {
            d.dateM = d.date_modify ? format(new Date(d.date_modify), 'dd-MM-yyyy HH:mm') : ''; 
            this.options = d;
            this.formOptions.get('header').setValue(this.options.content.header);
            this.formOptions.get('footer').setValue(this.options.content.footer);
            this.formOptions.get('main_header').setValue(this.options.content.main_header);
            this.formOptions.get('main_footer').setValue(this.options.content.main_footer);
        })
      },
      error =>  {
        this.showProgress = false;
        this.snackBar.open('Connection error', '', {
          duration: 2000,
        });
        this.errorMessage = <any>error
      });
  
  }

  previewDoc(element: any) {
    window.open(this._records.previewSite + '/' + this.type + '/' + element.url + '?preview=true', element.name, 'width=1200, height=900')
  }

  previewSite() {
    window.open(this._records.previewSite, this._records.previewSite, 'width=1200, height=900')
  }

  getItem(items: any[]): string {
    return items.length>0 ? items[0] + '...' : '<empty>'
  }

  editDoc(element: any): void {
    this.showProgress = true;
    this.openEditor = true;
    this.newDocument = false;
    this.formContent = [];
    this.formQuestionsContent = [];
    this.formQuestionsContentItems = [];
    this.document = element;
    this.form.get('html').setValue(this.document.content.text);

    if (this.document.content.content) {
      this.document.content.content.forEach(element => {
        this.formContent.push(new FormGroup({
          html: new FormControl()
        }));
        if (element.name === 'text' || element.name === 'right_img' || element.name === 'indent' || element.name === 'sub_title') {
          this.formContent[this.formContent.length-1].get('html').setValue(element.text)
        }
      })
    } else {
      this.document.content.content = []
    }
    
    this.showProgress = false;
  }

  addParam(n: any, v: any, params: Param[]): void{
    params.push({
      name: n.value,
      value: v.value
    })
  }

  addContent(n: any, params: any[]): void{
    this.formContent.push(new FormGroup({
      html: new FormControl()
    }));
    
    this.formContent[this.formContent.length-1].get('html').setValue('');
    
    params.push({
      name: n.value,
      text: '',
      items: []
    })
  }

  addItem(n: any, params: any[]) {
    params.push(n.value)
  }

  remove(param: Param, params: Param[]): void {
    const index = params.indexOf(param);
    if (index >= 0) {
      params.splice(index, 1);
    }
  }

  delContent(index: number) {
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Are you really want to delete content?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (index >= 0 && result) {
        this.document.content.content.splice(index, 1);
        this.formContent.splice(index, 1);
      }
    })
  } 

  upContent(index: number) {
    if (index>0) {
      this.arrayMove(this.document.content.content, index, index-1);
      this.arrayMove(this.formContent, index, index-1);
    }
  } 

  downContent(index: number) {
    if (index < this.document.content.content.length-1) {
      this.arrayMove(this.document.content.content, index, index+1);
      this.arrayMove(this.formContent, index, index+1);
    }
  } 

  arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  cancel(): void {
    this.openEditor = false;
    this.reloadData()
  }

  saveOptions (): void {
    this.options.content.header = this.formOptions.get('header').value;
    this.options.content.footer = this.formOptions.get('footer').value;
    this.options.content.main_header = this.formOptions.get('main_header').value;
    this.options.content.main_footer = this.formOptions.get('main_footer').value;
    this._records.postOptions(this.options, this.type).subscribe(data => {
      this.snackBar.open('Options saved', '', {
        duration: 2000,
      });
    }, error => console.log(<any>error))
  }
  
  publish(): void {
    this.document.published = true;
    this.saveData(true)  
  }

  saveData(closeDlg: boolean): void {
    if (!this.document.name) {
    } else {
      this.document.content.text = this.form.get('html').value;
      
      this.document.content.content.forEach((element, index) => {
        if (element.name === 'text' || element.name === 'right_img' || element.name === 'indent' || element.name === 'sub_title') {
          element.text = this.formContent[index].get('html').value
        }
      });

      if (this.newDocument) {
        this._records.postDocument(this.document, this.type).subscribe(data => {
          if (data.success) { 
            this.openEditor = !closeDlg;
            if (closeDlg) this.reloadData();
          }
        }, error => console.log(<any>error))
      } else {
        this._records.putDocument(this.document).subscribe(data => {
          if (data.success) { 
            this.openEditor = !closeDlg;
            if (!closeDlg) this.snackBar.open('Document saved', '', {
              duration: 2000,
            });
            if (closeDlg) this.reloadData();
          }
        }, error => console.log(<any>error))
      }
    }
  }

  delDoc(element: any): void {
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Are you really want to delete content?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._records.deleteDocument(element).subscribe(data => {
          if (data.success) { 
            this.reloadData()
          }
        }, error => console.log(<any>error))
      }
    });
  }

  copyDoc(element: any): void {
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Do you want to copy content?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._records.postDocument(element, this.type).subscribe(data => {
          if (data.success) { 
            this.reloadData()
          }
        }, error => console.log(<any>error))
      }
    })
  }

  getShort(t: string): string {
    return t ? t.substring(0, 40) + '...' : '...'
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.setFilter()
  }
  
  setFilter() {
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  getPageName(url: string): string {
    return this.dataSource.data.find(d => d.url === url).name
  }

  addPage() {
    if (!this.document.content.price_block) {
      this.document.content.price_block = [];
    }
    this.document.content.price_block.push({name: this.getPageName(this.selectedPage), url: this.selectedPage})
  }
}

