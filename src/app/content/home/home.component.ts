import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product';
import { Hero } from './hero';
import { HEROES } from './heroes';
import { ServProductsService } from 'src/app/shared/serv-products.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  sliderImages: Hero[] = HEROES;
  featuredProducts: Product[] = [];
  erro: string = '';

  constructor(private servProducts: ServProductsService, config: NgbCarouselConfig) {
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
    config.pauseOnFocus = false;
    config.animation = true;
    config.interval = 3000;
  }

  ngOnInit(): void {
    this.sliderImages.forEach(img => img.image = `/assets/${img.image}`);
    this.readData();
  }

  readData() {
    this.servProducts
      .getFeaturedProducts()
      .subscribe({
        next: response => {
          this.featuredProducts = response.body!;
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        },
      });
  }

}
