import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, OnInit } from '@angular/core';
import { PlaceServiceService } from '../place-service.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Espacio } from '~/lib/types';

@Component({
  selector: 'app-galery-place',
  standalone: true,
  imports: [
    CommonModule, NgFor, HttpClientModule
  ],
  templateUrl: './galery-place.component.html',
  styleUrl: './galery-place.component.css',
  providers:[CurrencyPipe]
})
export class GaleryPlaceComponent implements OnInit{

  espacios: Espacio[] = [];
  
  
  constructor(private galeryplaceService : PlaceServiceService) {}

  ngOnInit(): void {
    this.galeryplaceService.getPlaces().subscribe(data => {
      this.espacios = data;
    })
  }

}
