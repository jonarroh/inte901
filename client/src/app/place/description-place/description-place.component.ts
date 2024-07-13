import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceServiceService } from '../place-service.service';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';

@Component({
  selector: 'app-description-place',
  standalone: true,
  imports: [NgIf, NavbarComponent],
  templateUrl: './description-place.component.html',
  styleUrl: './description-place.component.css'
})
export class DescriptionPlaceComponent implements OnInit{

  espacio: any;

  constructor(private route: ActivatedRoute, private placeService: PlaceServiceService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placeService.getPlaceById(Number(id)).subscribe(data => {
        this.espacio = data;
      });
    }
  }

}
