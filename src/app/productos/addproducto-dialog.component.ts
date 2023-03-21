import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { AddImageService} from './addImagen.service'
@Component({
  selector: 'app-addproducto-dialog',
  templateUrl: './addproducto-dialog.component.html',
  styleUrls: ['./productos.component.css']

})
export class AddProductoDialogComponent implements OnInit, OnDestroy {
  data:any;
  result:any;
  cropperSettings: CropperSettings;
  image:any = this.addImageService.imageSrc;
@ViewChild('cropper', undefined) cropper:ImageCropperComponent;  

constructor(public addImageService:AddImageService) {
    
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.minWidth = 1;
    this.cropperSettings.width = 400;
    this.cropperSettings.height= 400;
    this.cropperSettings.minHeight = 1;
    this.cropperSettings.fileType = "image/jpg";
    this.cropperSettings.dynamicSizing = true;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.preserveSize = true;
    this.data = {}
    this.result = {}
    
   }

  cropPosition($event){
    this.result.imageH = $event.h;
    this.result.imageW = $event.w;
  }
  
  ngOnInit() {
    var image:any = this.image;
    var myReader:FileReader = new FileReader();
    console.log(this.data);
    setTimeout(()=>{
      
      this.cropper.setImage(image)},100);
      
  }
  ngOnDestroy(){
    this.result.image = this.data.image;
  }

}
