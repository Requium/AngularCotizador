import { Producto } from './producto.model';
import { Component, OnInit, ViewChild,Inject, Injectable, Input } from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AddImageService} from './addImagen.service'
import { AddProductoDialogComponent } from './addproducto-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import {Router} from "@angular/router";

@Component({
  selector: 'app-addproducto',
  templateUrl: './addproducto.component.html',
  styleUrls: ['./productos.component.css']
  
})
export class AddProductoComponent implements OnInit {
  @Input() producto:Producto
  imageReturn:any;
  imgHeight; 
  imgWidth ;
  compressedImage;
  modelo = new FormControl('',[Validators.required])
  descripcion = new FormControl('',[Validators.required])
  precioc = new FormControl('',[Validators.required])
  marca = new FormControl('',[Validators.required]) 
  area = new FormControl('',[Validators.required])
  edited = false;
  //se usa esta variable para el ngx-spinner y haga el loading.
  loading: boolean = false;
  constructor(public dialog: MatDialog, public addImageService:AddImageService, private http: HttpClient,private ng2ImgToolsService: Ng2ImgToolsService, private router: Router) {}
  saveProducto(){
    this.loading = true
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
       })
    };
    this.producto.modelo = this.producto.modelo.toUpperCase();
    this.producto.marca = this.producto.marca.toUpperCase();
    this.producto.proveedor = this.producto.proveedor.toUpperCase();
    this.producto.area = this.producto.area.toUpperCase();
    
    this.http.post('/producto', this.producto)
    .subscribe(
      data =>  {
        this.http.post('/imageupload',  {
          data: this.imageReturn,
          archivo: this.producto.modelo
        })
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        )

        this.router.navigateByUrl('/agregarempresa', {skipLocationChange: true}).then(()=>
        this.router.navigate(["/agregarproducto"]));
        this.loading = false;

      },

      error => {
        console.error(error)
        this.loading = false;
      }
    )
    
  }

  update(){
    this.loading = true
    this.edited = false;
    var producto:any = this.producto
    console.log('El producto es:', this.producto)
    console.log(this.imageReturn)
    this.http.post('/imageupload',{
      data:this.imageReturn,
      archivo:producto.modelo})
    .subscribe(data => {
    console.log(data)
    })
    //matchea la direccion de imagen completa debido a la modificacion de producto.imagen realizada en producto.component.ts para la busqueda de imagenes de autocomplete
    this.producto.imagen = this.producto.imagen.match(/:3000\/(.*)/)[1].toString()
    // console.log(this.producto.imagen)
    this.http.put('/producto/'+producto._id, this.producto)
    .subscribe(
      data => {
        this.router.navigateByUrl("/agregarempresa", {skipLocationChange: true}).then(()=>
        this.router.navigate(['/modificarproducto']));
        this.loading = false
       },
      error => {
        this.loading = false
        console.error(error)
      }
    )
           
  }

  fileListener($event){
  this.loading = true
  var file:File = $event.target.files[0];
  var uploadedImage: File;
  this.ng2ImgToolsService.resize([file], 10000, 600).subscribe(result => {
    uploadedImage = result//all good, result is a file 
    console.info(result);
    this.getImagePreview(uploadedImage)
}, error => {
    console.log(error)
    this.loading = false
        //something went wrong 
    //use result.compressedFile or handle specific error cases individually
});
  // this.getImagePreview(file);
  }

  getImagePreview(file:File){
    this.loading = false
    var myReader:FileReader = new FileReader();
    var image:any = new Image();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
         image.src = loadEvent.target.result;
         let dialogRef = that.dialog.open(AddProductoDialogComponent, {
          width: '400px',
          data: { },
          //evita q el dialogo se cierre  cuando se hace click fuera de el
          disableClose: true
        });
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          console.log(result)
          var blob = that.dataURItoBlob(result.image);
          console.log(blob)
          var croppedImgFile = new File([blob], 'cropedImg.png',{type: 'image/png'})
          console.log(croppedImgFile)
          that.compressedImage = that.compressImage(croppedImgFile,result.imageW,result.imageH)

        });       
      }
       myReader.readAsDataURL(file);

      console.log('El archivo es',file);
      // myReader.readAsDataURL(file);

      this.addImageService.fileChangeListener(image) 
  }

  compressImage(file:File,W,H){
    var uploadedImage: File;
    var that = this
    this.imgHeight = 64
    this.imgWidth = (W*64)/H
    this.ng2ImgToolsService.resize([file], 10000, 64).subscribe(result => {
    uploadedImage = result//all good, result is a file 
    console.info(result);
    var reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    
    reader.onloadend = function() {
     that.imageReturn  = reader.result;
    }
    this.imageReturn = that.imageReturn
        return uploadedImage  
}, error => {
    console.log(error)
    this.loading = false
    return error
    //something went wrong 
    //use result.compressedFile or handle specific error cases individually
});
  }

  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.toString().split(',')[1]);

    //var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: 'image/png'}); //or mimeString if you want
    return blob;
}
  ngOnInit() {
    console.log(this.modelo.valid)
    if(!this.producto){
      this.producto = new Producto('','','','',null,null,'pieza','','',false,'')
     }
     else{
      this.edited = true
     }
     console.log(this.imageReturn)
    }
  }


