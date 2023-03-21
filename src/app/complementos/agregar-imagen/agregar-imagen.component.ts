import { Component, OnInit, Output, AfterViewInit, SimpleChanges } from '@angular/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { MatDialog } from '@angular/material';
import { AddImageService } from '../../productos/addImagen.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddProductoDialogComponent } from '../../productos/addproducto-dialog.component';
import { Cell, DefaultEditor, Editor} from 'ng2-smart-table';
@Component({
  selector: 'app-agregar-imagen',
  templateUrl: './agregar-imagen.component.html',
  styleUrls: ['./agregar-imagen.component.css']
})
export class AgregarImagenComponent extends DefaultEditor implements OnInit  {
  loading: boolean = false;
  imageReturn:any;
  imgHeight; 
  imgWidth;
  imagenReady:boolean = false;
  compressedImage
  customInput:string
  customCall:string
  constructor(public dialog: MatDialog, public addImageService:AddImageService, private http: HttpClient,private ng2ImgToolsService: Ng2ImgToolsService) {
    super();
  }
  onClickFile(){
    //Busqueda del uploader de archivo en funcion a numero randomico generado
    document.getElementById(this.customInput).click()
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
            console.log('  The dialog was closed');
            var blob = that.dataURItoBlob(result.image);
            var croppedImgFile = new File([blob], 'cropedImg.png',{type: 'image/png'})
            that.compressedImage = that.compressImage(croppedImgFile,result.imageW,result.imageH)          
          });       
        }
        this.imageReturn = that.imageReturn;
        this.imgHeight = that.imgHeight;
        this.imgWidth = that.imgWidth;
        
        console.log('El archivo es',file);
        myReader.readAsDataURL(file);
        this.addImageService.fileChangeListener(image) 
    }
  
    compressImage(file:File,W,H){
      var uploadedImage: File;
      var that = this
      this.imgHeight = 64
      this.imgWidth = (W*64)/H
      this.ng2ImgToolsService.resize([file], 10000, 192).subscribe(result => {
      uploadedImage = result//all good, result is a file 
      console.info(result);
      var reader = new FileReader();
      
      reader.readAsDataURL(uploadedImage);
      
      reader.onloadend = function() {
       that.imageReturn  = reader.result;
       console.log('imagen:',that.imageReturn, 'archivo:',that.cell.getRow().cells[0].newValue)

        that.http.post('/imageupload',{
          
          data:that.imageReturn,
          archivo:that.cell.getRow().cells[0].newValue
          }).subscribe(data => console.log('Imagen Guardada, con Nombre:'+that.cell.getRow().cells[0].newValue))
  
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
    //Generacion de ID randomico para identificacion de filas en la tabla de productos
     var customNumber = Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 1000) + 1);
     this.customInput = customNumber.toString();
    }
     
}
