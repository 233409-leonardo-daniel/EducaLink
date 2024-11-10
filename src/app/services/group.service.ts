import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

interface Group {
  image: string;
  name: string;
  admin: string;
  members: number;
  isPublic: boolean;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }

  getGroups(): Observable<Group[]> {
    return of([
      {
        image: 'https://via.placeholder.com/50',
        name: 'Grupo 1',
        admin: 'Admin 1',
        members: 123,
        isPublic: true,
        description: 'Descripción del grupo 1'
      },
      {
        image: 'https://via.placeholder.com/50',
        name: 'Grupo 2',
        admin: 'Admin 2',
        members: 456,
        isPublic: false,
        description: 'Descripción del grupo 2'
      },
      // Otros grupos...
    ]);
  }
}

