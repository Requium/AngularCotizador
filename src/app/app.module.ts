import { AddCotizacionComponent } from './ordenes/addcotizacion.component';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSidenavModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { CotizacionComponent } from './ordenes/cotizacion.component';
import { ProductosComponent } from './productos/productos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material';
import { AddEmpresasComponent } from './empresas/addempresas.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddProductoComponent } from './productos/addproducto.component';
import { ImageCropperModule } from 'ng2-img-cropper/index';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddProductoDialogComponent } from './productos/addproducto-dialog.component';
import { AddImageService } from './productos/addImagen.service';
import { routing } from './app.routing';
import { AddNotaEntregaComponent  } from './ordenes/addnotaentrega.component';
import { Ng2SmartTableModule,LocalDataSource  } from 'ng2-smart-table';
import { NotasComponent } from './ordenes/notas.component';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { ComplementosComponent } from './complementos/complementos.component'; 
import { ComplementoCotizadosComponent, ButtonViewComponent, DialogDataComponent } from './complementos/complementocotizados.component';
import { NotaEntregaComponent } from './ordenes/notaentrega.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { BuscadorProductosComponent } from './productos/buscador-productos/buscador-productos.component';
import { AgregarImagenComponent } from './complementos/agregar-imagen/agregar-imagen.component';
import { BuscadorEmpresasComponent } from './empresas/buscador-empresas/buscador-empresas.component';
import { DatepickerComponent } from './complementos/datepicker/datepicker.component';


@NgModule({
  declarations: [
    AppComponent,
    CotizacionComponent,
    ProductosComponent,
    EmpresasComponent,
    AddEmpresasComponent,
    UsuariosComponent,
    AddProductoComponent,
    AddCotizacionComponent,
    AddProductoDialogComponent,
    AddNotaEntregaComponent,
    NotasComponent,
    ComplementosComponent,
    ComplementoCotizadosComponent,
    NotaEntregaComponent,
    ButtonViewComponent,
    DialogDataComponent,
    BuscadorProductosComponent,
    AgregarImagenComponent,
    BuscadorEmpresasComponent,
    DatepickerComponent,


    ],
    entryComponents:[
      AddProductoDialogComponent,
      ButtonViewComponent,
      DialogDataComponent,
      AgregarImagenComponent,
      CotizacionComponent,
      DatepickerComponent  

    ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatButtonModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatStepperModule,
    MatAutocompleteModule,
    Ng2SmartTableModule,
    routing,
    ImageCropperModule,
    Ng2ImgToolsModule,
    MatProgressSpinnerModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.circleSwish,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#f15a24', 
      secondaryColour: '#f7931e', 
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
  })
    

    
  ],
  providers: [
    AddImageService,  
    DatepickerComponent
    
  ],
  bootstrap: [
    AppComponent
    ]
})
export class AppModule { }
