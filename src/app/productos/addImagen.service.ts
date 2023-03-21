import 'rxjs/Rx';
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
@Injectable()
export class AddImageService{

    constructor(){}
    imageSrc:any;
    fileChangeListener(imgSrc) {
        this.imageSrc = imgSrc; 
    }


}