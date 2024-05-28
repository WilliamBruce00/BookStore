import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { forkJoin } from 'rxjs';
import { DetailsService } from '../../services/details.service';
import { Details } from '../../models/details.model';
import { FooterComponent } from '../../components/footer/footer.component';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CardProductComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  categories!: Category[];
  categoryProduct: any;

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private detailsService: DetailsService
  ) {}

  ngOnInit(): void {
    this.getListCategory();
    this.getListProductNew();
  }

  getListCategory(): void {
    this.categoriesService.findAll().subscribe({
      next: (data: Category[]) => {
        this.categories = data;

        console.log(data);
      },
      error: (err) => {
        throw err;
      },
    });
  }

  getListProductNew(): void {
    forkJoin([
      this.categoriesService.findAll(),
      this.productService.findAll(),
    ]).subscribe({
      next: ([category, product]: [Category[], Product[]]) => {
        this.categoryProduct = category.map((item: Category) => {
          return {
            ...item,
            product: product
              .filter((prod: Product) => prod.CategoryID === item.id)
              .reverse()
              .slice(0, 8),
          };
        });
      },
    });
  }
}
