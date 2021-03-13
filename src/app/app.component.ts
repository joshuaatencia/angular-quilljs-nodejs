import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quill-test';
  editor: any;
  IMG_API_URL = 'http://localhost:3000/file';
  file: any;
  allImg = [];
  prueba: string;
  loading = false;
  reader = new FileReader();

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['image']                         // link and image, video
    ]
  };

  constructor(private http: HttpClient) {
    this.prueba = "assets/image"
    this.loading = false;

    this.http.get('http://localhost:3000/imagenes').subscribe(data => {

      data['files'].forEach(element => {
        this.allImg.push(`assets/image/${element}`);
      });
    });

  }



  EditorCreated(editor: any) {

    editor.getModule('toolbar').addHandler('image', () => {

      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/x-icon');
      input.click();

      input.onchange = () => {
        this.file = input.files[0];
        console.log(this.file.name);
        const range = editor.getSelection();
        this.reader.readAsDataURL(this.file);
        this.reader.onload = () => {
          editor.insertEmbed(range.index, 'image', this.reader.result);
        };
      };

    });
  }

  onSubmit() {
    if (this.file != null) {
      this.loading = true
      this.reader = null;
      if (/^image\//.test(this.file.type)) {
        let formData = new FormData();
        formData.append('pathName', 'forage');
        formData.append('file', this.file);
        this.http.post('http://localhost:3000/file', formData)
          .subscribe(event => {
            this.file = null;
            console.log(event['path']);
          });
      } else {
        console.warn('Solo puedes cargar imagenes');
      }


    }
  }

}
