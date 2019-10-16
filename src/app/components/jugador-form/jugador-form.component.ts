import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { JugadorService } from '../../services/jugador.service';
import { Jugador } from '../../models/jugador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jugador-form',
  templateUrl: './jugador-form.component.html',
  styleUrls: ['./jugador-form.component.css']
})
export class JugadorFormComponent implements OnInit {

  private _jugadorForm:FormGroup;
  private _jugador:Jugador;
  private _fileImagen:File;

  constructor(private jugadorService:JugadorService,
            private activadtedRouter:ActivatedRoute,
            private router:Router) {

                this.jugador = new Jugador();

  }

  ngOnInit() {
      this.inicializarForm();

      this.activadtedRouter.params.subscribe(params => {
          if(params['id'] != undefined){
              this.jugadorService.obtenerJugador(params['id'])
                .subscribe(jugador => {
                    this.jugador = jugador;
                    this.inicializarForm();
                })
          }
      })
  }

  guardarJugador(){
      if(this.jugadorForm.valid){

          if(this.fileImagen != undefined && this.fileImagen != null && this.fileImagen.size > 1000000){
              Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: `La imagen no debe superar 1MB`
              });
          }
          else{
              this.jugador.nombre = this.jugadorForm.controls.nombre.value;
              this.jugador.habilidadEspecial = this.jugadorForm.controls.habilidadEspecial.value;

              if(this.jugador.id != null){
                  this.jugadorService.updateJugador(this.jugador)
                  .subscribe(data => {
                      this.router.navigate(["/home"]);
                  });
              }
              else{
                  
              }
          }
      }
  }

  public onFileChange(event) {
      let reader = new FileReader();
      this.fileImagen = event.target.files[0];
  }

  private inicializarForm(){
      this.jugadorForm = new FormGroup({
          'nombre': new FormControl(this.jugador.nombre, [
                                        Validators.required
                                    ]),
          'habilidadEspecial': new FormControl(this.jugador.habilidadEspecial, [Validators.maxLength(20)]),
          'file' : new FormControl()
      });
  }

  get fileImagen():File{
      return this._fileImagen;
  }

  set fileImagen(fileImagen:File){
      this._fileImagen = fileImagen;
  }

  get jugadorForm():FormGroup{
      return this._jugadorForm;
  }

  set jugadorForm(jugadorForm:FormGroup){
      this._jugadorForm = jugadorForm;
  }

  get jugador():Jugador{
      return this._jugador;
  }

  set jugador(jugador:Jugador){
      this._jugador = jugador;
  }

}
