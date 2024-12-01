import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceServiceService } from '../place-service.service';
import { NgIf, NgFor } from '@angular/common';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { Espacio } from '../../../lib/types';

@Component({
  selector: 'app-description-place',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NavbarComponent,
    HlmCarouselComponent,
    HlmCarouselContentComponent,
    HlmCarouselItemComponent,
    HlmCarouselNextComponent,
    HlmCarouselPreviousComponent
  ],
  templateUrl: './description-place.component.html',
  styleUrls: ['./description-place.component.css']
})
export class DescriptionPlaceComponent implements OnInit {

  espacio: any;
  images: string[] = [];
  
  constructor(private route: ActivatedRoute, private placeService: PlaceServiceService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placeService.getPlaceById(Number(id)).subscribe(data => {
        this.espacio = data;
        this.images = [
          `http://191.101.1.86:5000/static/places/${id}.webp`, // Imagen dinámica basada en el ID del espacio
          'http://191.101.1.86:5000/static/places/op2.webp',
          'http://191.101.1.86:5000/static/places/op3.webp',
          'http://191.101.1.86:5000/static/places/op4.webp'
        ];
      });
    }
  }

  verReserva(id: number): void {
    this.router.navigate(['/reserves', id]);
  }
  

 
  
}
