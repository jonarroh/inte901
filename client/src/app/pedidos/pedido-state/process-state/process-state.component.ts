import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-process-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-state.component.html',
  styleUrl: './process-state.component.css'
})
export class ProcessStateComponent implements OnInit {

  status : string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] || null;
    });
  }
}
