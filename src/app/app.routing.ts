import { ProductosComponent } from './productos/productos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { AddCotizacionComponent } from './ordenes/addcotizacion.component';
import { Routes,RouterModule} from "@angular/router";
import { AddEmpresasComponent } from './empresas/addempresas.component';
import { AddProductoComponent } from './productos/addproducto.component';
import { AddNotaEntregaComponent } from './ordenes/addnotaentrega.component';
import { CotizacionComponent } from './ordenes/cotizacion.component';
import { NotaEntregaComponent } from './ordenes/notaentrega.component';


const APP_ROUTES: Routes = [ 
    {path: '', redirectTo: '/agregarempresa', pathMatch: 'full'},
    {path: 'agregarempresa', component: AddEmpresasComponent},
    {path: 'agregarproducto', component: AddProductoComponent},
    {path: 'agregarcotizacion', component: AddCotizacionComponent},
    {path: 'modificarcotizacion', component: CotizacionComponent},
    {path: 'modificarempresa', component: EmpresasComponent},
    {path: 'modificarproducto', component: ProductosComponent},
    {path: 'agregarnotaentrega', component:AddNotaEntregaComponent },
    {path: 'modificarnotaentrega', component: NotaEntregaComponent}

];
RouterModule
RouterModule.forRoot(APP_ROUTES);

export const routing = RouterModule.forRoot(APP_ROUTES);