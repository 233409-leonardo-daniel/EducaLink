
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common'; // Agregar este import
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TreeSelectModule, 
    NavbarComponent
  ],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  category: string | null = null;
  formGroup: FormGroup;
  selectedDescription: string | null = null; 

  nodes: any[] = [
    {
      label: 'Tu cuenta EducaLink',
      children: [
        { 
          label: 'Configuración de la cuenta',
          description: 'Configura los datos básicos de tu cuenta, como correo, nombre de usuario y preferencias en editar, esto lo podemos encontrar en la perte superior "Es un botón con tu perfil".'
        },
        { 
          label: 'Cambiar contraseña',
          description: 'Para cambiar la contraseña damos clic a perfil y en "editar perfil" podemos editar la imagen de fondo, la imagen de perfil, el nombre, apellido, nivel educativo, grupo y contraseña.'
        },
      ],
    },
    {
      label: 'Aspectos básicos',
      children: [
        { 
          label: 'Cómo registrarse',
          description: 'En el login hay un apartado que dice "crear cuenta". La información que se solicita incluye nombre, apellido, correo, nivel educativo, grado y contraseña.'
        },
        { 
          label: 'Primeros pasos',
          description: 'En "Primeros pasos" se guía al usuario sobre la función de cada parte de la app web. Por ejemplo: cómo iniciar sesión (pide correo y contraseña) y cómo registrarse (nombre, apellido, correo, nivel educativo, grado, contraseña).'
        },
      ],
    },
    {
      label: 'Posts y comentarios',
      children: [
        { 
          label: 'Cómo crear un post',
          description: 'En la página principal del Home hay una sección llamada "¿Qué estás pensando?". Al hacer clic, se puede subir una imagen o archivo, agregar un título, descripción y etiquetas.'
        },
        { 
          label: 'Reglas de comentarios',
          description: 'Podemos comentar en los posts de las personas a las que seguimos o en los posts del grupo al que pertenecemos. Las reglas de comportamiento aplican.'
        },
      ],
    },
    {
      label: 'Comunidades',
      children: [
        { 
          label: 'Unirse a una comunidad',
          description: 'Para unirse a un grupo, vamos a la sección de "grupos", buscamos o filtramos el grupo, y hacemos clic en "unirse". Si es un grupo privado, se solicita la contraseña.'
        },
        { 
          label: 'Reglas de las comunidades',
          description: 'Revisa las políticas de comportamiento para mantener la armonía en las comunidades.'
        },
      ],
    },
    {
      label: 'Crear grupo',
      children: [
        { 
          label: 'Funciones de administrador',
          description: 'Conoce las herramientas avanzadas disponibles para los administradores de grupo.'
        },
        { 
          label: 'Herramientas de administrador',
          description: 'Gestiona usuarios, publicaciones y configuraciones específicas de tu grupo.'
        },
      ],
    },
    {
      label: 'Más respuestas',
      children: [
        { 
          label: 'Soporte técnico',
          description: 'Obtén ayuda técnica para resolver problemas relacionados con la plataforma.'
        },
        { 
          label: 'Políticas de la comunidad',
          description: 'Consulta las políticas generales que rigen el uso de EducaLink y sus servicios.'
        },
      ],
    },
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.formGroup = this.fb.group({
      selectedNodes: [null],
    });
  }

  ngOnInit() {
    // Obtener el parámetro de la categoría de la URL
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
    });
  }

  // Método para manejar la selección del nodo
  onNodeSelect(event: any): void {
    const selectedNode = event.node;
    this.selectedDescription = selectedNode?.description || 'No hay descripción disponible.';
  }
}
