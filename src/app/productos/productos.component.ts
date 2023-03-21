import { LocalDataSource } from 'ng2-smart-table';
import { Producto } from './producto.model';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],

})
export class ProductosComponent implements OnInit {
  @Input() cotizacion
  @Output() productosForm = new EventEmitter<any>();
  loading: boolean = false;
  selectedProducto: Producto;
  dataProductos
  selected:any;
  busqueda:string;
  stateCtrl: FormControl;
  filteredProductos: Observable<any[]>;
  total:number = 0;
  totalCompra:number = 0;
  IVA:number=13;
  IT:number=3;
  IVAVenta:number=0;
  ITVenta:number=0;
  IVACompra:number = 0;
  impuestoFacturaIVA:number = 0;
  creditoFiscal:number = 0;
  utilidad:number = 0;

  facturaVenta:boolean = true
  settings = {
    pager:{
      display:true,
      perPage:20
    },
    columns: {
      modelo: {
        title: 'Modelo',
        filter: false,
        class: 'tableColumn',
        width:'10%'
      },
      descripcion: {
        title: 'Descripcion',
        filter: false,
        editor:{
          type: 'textarea'
        },
        width:'%'
      },
      precioc: {
        title: 'Precio de Compra',
        filter: false,
        editable:false,
        class: 'tableColumn',
        width:'6%'
      },
      facturaCompra:{
        title: 'Compra con factura',
        filter:false,
        class:'tableColumn',
        width: '6%',
        type: 'html',
        valuePrepareFunction: (facturaCompra) => {
          if (facturaCompra === true){
            return 'Si'
          }
          else{
            return 'No'
          }
        },
        editor:{
          type: 'checkbox',
          config: {
            true: 'Si',
            false: 'No'
          }
        }
     },
      subtotalCompra:{
        title: 'Subtotal Compra',
        filter:false,
        editable:false,
        class:'tableColumn',
        width: '9%'
      },
      preciov: {
        title: 'PrecioVenta',
        filter: false,
        class: 'tableColumn',
        width:'6%'
      },
      
      cantidad:{
        title:'Cantidad',
        filter: false,
        class: 'tableColumn',
        width:'5%'
      },
      subtotal:{
        title:'Subtotal',
        filter: false,
        class:'tableColumn',
        editable: false,
        width:'9%'
      }
    },
    actions:{
      add: false,
      columnTitle: '',
      position: 'right'
    },
    edit:{
      editButtonContent:'Editar',
      saveButtonContent:'Guardar',
      cancelButtonContent:'Cancelar',
      confirmSave: true
    },
    delete:{
      deleteButtonContent:'Eliminar',
      confirmDelete: true
    }
  };
  data= []
  source = new LocalDataSource(this.data);
  productos: any = [];

  constructor(private http:HttpClient) {
    this.stateCtrl = new FormControl();
    this.filteredProductos = this.stateCtrl.valueChanges
      .pipe(
        map(producto => producto ? this.filterStates(producto) : null)  
      );
   }

  filterStates(name: string) {
    if (name.length >=2){this.http.get('/producto/'+name)
    .subscribe(
      data => {
        console.log(data)
        this.productos = data 
        for (var i = 0 ;i < this.productos.length;i++){
          this.productos[i].imagen = 'http://127.0.0.1:3000/'+this.productos[i].imagen
        }
      })
    return this.productos.filter(producto =>
      producto.modelo.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }
  }
  mostrarProductos(){
    console.log(this.busqueda);
    this.dataProductos = undefined
    if (!this.busqueda) {
      this.busqueda = ''
    }
    this.http.get('/producto/'+this.busqueda)
    .subscribe (
      data => {
        console.log(data)
        this.dataProductos = data
      }
    )
  }
  selectProducto(producto) {
    this.selectedProducto = producto;
    this.selected = 'true';
    // console.log(producto)
  }

  addProductoToTable(){
    // console.log('Click!');
    this.total = 0;
    this.totalCompra = 0;
    this.IVACompra = 0;
    this.IVAVenta = 0;
    this.ITVenta = 0;
    this.impuestoFacturaIVA = 0;
    this.creditoFiscal = 0
    this.utilidad = 0;
    if (this.selectedProducto){
       var newItem = {
        modelo: this.selectedProducto.modelo,
        descripcion: this.selectedProducto.descripcion,
        imagen: this.selectedProducto.imagen,
        cantidad: 1,
        preciov: this.selectedProducto.preciov,
        subtotal:0,
        subtotalCompra:0,
        precioc: this.selectedProducto.precioc,
        facturaCompra: false,
        garantia: this.selectedProducto.garantia,
        marca:this.selectedProducto.marca,
        unidad:this.selectedProducto.unidad
        }
        newItem.subtotal = newItem.cantidad * newItem.preciov;
        newItem.subtotalCompra = newItem.cantidad * newItem.precioc
        console.log(newItem)
      // this.data.push(newItem);
      // this.source.refresh();
      this.source.append(newItem)
      this.data=[]
      this.source.getAll().then(value => { 
        value.forEach(element => {
        this.data.push(element); 
        });;
      }).then(() => {for (var i = 0; i < this.data.length;i ++){
        if(this.data[i].facturaCompra === true){
          this.IVACompra = this.IVACompra + ((this.data[i].subtotalCompra*this.IVA)/100)
        }
        if(this.facturaVenta === true){
          console.log(this.IVA)
          this.IVAVenta = this.IVAVenta + ((this.data[i].subtotal*this.IVA)/100)
          console.log('IVAVenta',this.IVAVenta)
          this.ITVenta = this.ITVenta + ((this.data[i].subtotal*this.IT)/100)
          console.log(this.IT)
          console.log('ITVenta',this.ITVenta)
        }
        this.ITVenta = Math.ceil(this.ITVenta*100)/100;
        this.total = this.total + this.data[i].subtotal;
        this.totalCompra = this.totalCompra + this.data[i].subtotalCompra
        this.impuestoFacturaIVA = Math.round((this.IVAVenta - this.IVACompra)*100)/100;
        if(this.impuestoFacturaIVA > 0){
          console.log('Utilidad')
          console.log(this.impuestoFacturaIVA)
          console.log(this.ITVenta)
          console.log(this.total)
          console.log(this.totalCompra)
          this.utilidad = Math.round((this.total - this.totalCompra - this.impuestoFacturaIVA - this.ITVenta)*100)/100
        }
        else{
          this.utilidad = Math.round((this.total - this.totalCompra - this.ITVenta)*100)/100
          this.creditoFiscal = this.impuestoFacturaIVA * -1
        }
        console.log(this.totalCompra)
        console.log(this.data)
        // console.log(this.data[i].subtotal)
        // console.log(this.total)
       }}).then(() => {
          this.productosForm.emit(
            {
              data:this.data,
              total:this.total,
              totalCompra: this.totalCompra,
              IVACompra: this.IVACompra,
              IVAVenta: this.IVAVenta,
              impuestoFacturaIVA: this.impuestoFacturaIVA,
              ITVenta:this.ITVenta,
              utilidad:this.utilidad,
              creditoFiscal:this.creditoFiscal,
              facturaVenta:this.facturaVenta        
            });
       });
      // console.log("La data agregada es:",this.data)

      
      // console.log('el item nuevo es:',newItem)
      // console.log('el vector es:',this.source)
    }
  }
onSave(event) { 
  // console.log('modificado');
  // console.log(event);
  this.totalCompra = 0
  this.total = 0;
  this.IVACompra = 0;
  this.IVAVenta = 0;
  this.ITVenta = 0;
  this.impuestoFacturaIVA = 0;
  this.creditoFiscal = 0
  this.utilidad = 0;
 var myRegexp =/%(.*)/;
 var match = myRegexp.exec(event.newData.preciov);
 if(match){
 event.newData.preciov = Math.ceil((1+(Number(match[1])/100)) * event.data.precioc)}
 console.log(event.newData)
 if (event.newData.facturaCompra === 'Si'||event.newData.facturaCompra === true){
  event.newData.facturaCompra = true
  }
  else {
  event.newData.facturaCompra = false
  }  
  
 event.newData.subtotal = event.newData.preciov * event.newData.cantidad;
 event.newData.subtotalCompra = event.newData.cantidad * event.newData.precioc
 event.confirm.resolve(event.newData)
//  console.log("data:",this.data)
//  console.log("source:",this.source)
 this.data=[]
 this.source.getAll().then(value => { 
  value.forEach(element => {
      this.data.push(element);
  }); 
  console.log(typeof this.data)
}).then(() => {
  for (var i = 0; i < this.data.length;i ++){
    if(this.data[i].facturaCompra === true){
      this.IVACompra = this.IVACompra + ((this.data[i].subtotalCompra*this.IVA)/100)
    }
    if(this.facturaVenta === true){
      this.IVAVenta = this.IVAVenta + ((this.data[i].subtotal*this.IVA)/100)
      this.ITVenta = this.ITVenta + ((this.data[i].subtotal*this.IT)/100)
    }
    this.ITVenta = Math.ceil(this.ITVenta*100)/100;
    this.total = this.total + this.data[i].subtotal;
    this.totalCompra = this.totalCompra + this.data[i].subtotalCompra
    this.impuestoFacturaIVA = Math.round((this.IVAVenta - this.IVACompra)*100)/100;
    if(this.impuestoFacturaIVA > 0){
      this.utilidad = Math.round((this.total - this.totalCompra - this.impuestoFacturaIVA - this.ITVenta)*100)/100
      this.creditoFiscal = 0
    }
    else{
      this.utilidad = Math.round((this.total - this.totalCompra - this.ITVenta)*100)/100
      this.creditoFiscal = this.impuestoFacturaIVA * -1
    }
  // console.log(this.data[i].subtotal)
  // console.log(this.total)
  } 
}).then(() => {
    this.productosForm.emit({
    data:this.data,
    total:this.total,
    totalCompra: this.totalCompra,
    IVACompra: this.IVACompra,
    IVAVenta: this.IVAVenta,
    impuestoFacturaIVA: this.impuestoFacturaIVA,
    ITVenta:this.ITVenta,
    utilidad:this.utilidad,
    creditoFiscal:this.creditoFiscal,
    facturaVenta:this.facturaVenta
  }); 
});
  //  console.log("El total es:",this.total)
}
onFacturaVenta(event){
  this.IVAVenta = 0;
  this.ITVenta = 0;
  if (event.checked === true)
  {
    for (var i = 0; i < this.data.length;i ++){
      this.IVAVenta = this.IVAVenta + ((this.data[i].subtotal*this.IVA)/100)
      this.ITVenta = this.ITVenta + ((this.data[i].subtotal*this.IT)/100)     
  }
  this.ITVenta = Math.ceil(this.ITVenta*100)/100;
    }
      this.impuestoFacturaIVA = Math.round((this.IVAVenta - this.IVACompra)*100)/100;
      if(this.impuestoFacturaIVA > 0){
          this.utilidad = Math.round((this.total - this.totalCompra - this.impuestoFacturaIVA - this.ITVenta)*100)/100
          this.creditoFiscal = 0
        }
        else{
          this.utilidad = Math.round((this.total - this.totalCompra - this.ITVenta)*100)/100
          this.creditoFiscal = this.impuestoFacturaIVA * -1      
    }
    this.productosForm.emit({
      data:this.data,
      total:this.total,
      totalCompra: this.totalCompra,
      IVACompra: this.IVACompra,
      IVAVenta: this.IVAVenta,
      impuestoFacturaIVA: this.impuestoFacturaIVA,
      ITVenta:this.ITVenta,
      utilidad:this.utilidad,
      creditoFiscal:this.creditoFiscal,
      facturaVenta:this.facturaVenta
    }); 
}

onDelete(event){
  this.total = 0;
  this.totalCompra = 0
  this.IVACompra = 0;
  this.IVAVenta = 0;
  this.ITVenta = 0;
  this.impuestoFacturaIVA = 0;
  this.creditoFiscal = 0
  this.utilidad = 0;
  this.source.remove(event.data);
  event.confirm.resolve();
  this.data = []
  this.source.getAll().then(value => { 
    value.forEach(element => {
        this.data.push(element);       
    }
  )}).then(()=> {
      for (var i = 0; i < this.data.length;i ++){
        if(this.data[i].facturaCompra === true){
          this.IVACompra = this.IVACompra + ((this.data[i].subtotalCompra*this.IVA)/100)
        }
        if(this.facturaVenta === true){
          this.IVAVenta = this.IVAVenta + ((this.data[i].subtotal*this.IVA)/100)
          this.ITVenta = this.ITVenta + ((this.data[i].subtotal*this.IT)/100)
        }
        this.ITVenta = Math.ceil(this.ITVenta*100)/100;
        this.total = this.total + this.data[i].subtotal;
        this.totalCompra = this.totalCompra + this.data[i].subtotalCompra
        this.impuestoFacturaIVA = Math.round((this.IVAVenta - this.IVACompra)*100)/100;
        if(this.impuestoFacturaIVA > 0){
          this.utilidad = Math.round((this.total - this.totalCompra - this.impuestoFacturaIVA - this.ITVenta)*100)/100
        }
        else{
          this.utilidad = Math.round((this.total - this.totalCompra - this.ITVenta)*100)/100
          this.creditoFiscal = this.impuestoFacturaIVA * -1
        }
   }
  }).then(()=> {
    this.productosForm.emit(
      {
        data:this.data,
        total: this.total,
        totalCompra: this.totalCompra,
        IVACompra: this.IVACompra,
        IVAVenta: this.IVAVenta,
        impuestoFacturaIVA: this.impuestoFacturaIVA,
        ITVenta:this.ITVenta,
        utilidad:this.utilidad,
        creditoFiscal:this.creditoFiscal,
        facturaVenta:this.facturaVenta
        });
  });
  }
  ngOnInit() {
    console.log(this.cotizacion)
    if(this.cotizacion){
    if(this.cotizacion.ID){
      this.loading = true;
      console.log('Recepcion de cotizacion:',this.cotizacion)
      var datos
      var productos
      var nota
      var editNota ={
        empresa:this.cotizacion.empresa.nombre,
        Id:this.cotizacion.ID
      }
      console.log('iniciando20')
      console.log(this.cotizacion.ID)
      this.http.post('/cotizaciones/search', editNota)
      .subscribe(
        data => {
          datos = data
          this.facturaVenta = datos.facturaVenta
          productos = datos.productos
          for (var i = 0 ;i <productos.length; i++){
              this.data.push(productos[i])
              if(this.data[i].facturaCompra === true){
                this.IVACompra = this.IVACompra + ((this.data[i].subtotalCompra*this.IVA)/100)
              }
              if(this.facturaVenta === true){
                this.IVAVenta = this.IVAVenta + ((this.data[i].subtotal*this.IVA)/100)
                this.ITVenta = this.ITVenta + ((this.data[i].subtotal*this.IT)/100)
              }
              this.IVAVenta = Math.ceil(this.IVAVenta*100)/100;
              this.IVACompra = Math.ceil(this.IVACompra*100)/100;
              this.ITVenta = Math.ceil(this.ITVenta*100)/100;
              this.total = this.total + productos[i].subtotal
              this.totalCompra = this.totalCompra + (productos[i].cantidad * productos[i].precioc)
              this.impuestoFacturaIVA = Math.round((this.IVAVenta - this.IVACompra)*100)/100;
              if(this.impuestoFacturaIVA > 0){
                this.utilidad = Math.round((this.total - this.totalCompra - this.impuestoFacturaIVA - this.ITVenta)*100)/100
              }
              else{
                this.utilidad = Math.round((this.total - this.totalCompra - this.ITVenta)*100)/100
                this.creditoFiscal = this.impuestoFacturaIVA * -1
              }
           
              console.log("la tabla es",this.data)
        }
        this.source = new LocalDataSource(this.data);
        this.loading = false;
        this.productosForm.emit(
          {
            data:this.data,
            total: this.total,
            totalCompra: this.totalCompra,
            facturaVenta: this.facturaVenta
          });
      })
    }
    }
  }
}