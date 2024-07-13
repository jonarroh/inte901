import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, OnInit } from '@angular/core';
import { PlaceServiceService } from '../place-service.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Espacio } from '~/lib/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galery-place',
  standalone: true,
  imports: [
    CommonModule, NgFor
  ],
  templateUrl: './galery-place.component.html',
  styleUrl: './galery-place.component.css',
  providers:[CurrencyPipe]
})
export class GaleryPlaceComponent implements OnInit{

  espacios: any[] = [];

  constructor(private placeService: PlaceServiceService, private router: Router) {}

  ngOnInit(): void {
    this.placeService.getPlaces().subscribe(data => {
      this.espacios = data;
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/places', id]);
  }

}
