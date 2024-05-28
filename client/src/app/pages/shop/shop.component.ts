import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CardProductComponent } from '../../components/card-product/card-product.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    NumberFormatPipe,
    CardProductComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit, OnDestroy {
  @ViewChild('viewmore') viewmore!: ElementRef;

  categories!: Category[];
  filterPrice: number[][] = [
    [0, 150000],
    [150000, 300000],
    [300000, 500000],
    [500000, 700000],
    [700000],
  ];
  products!: Product[];
  numpage: number = 1;

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategory();
    this.getProduct();

    this.setLinkActive(this.router.url);
  }

  ngOnDestroy(): void {
    console.log('Cancel compnent');
  }

  getCategory(): void {
    this.categoriesService.findAll().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err) => {
        throw err;
      },
    });
  }

  setCategoryQueryParam(data: number) {
    this.viewmore?.nativeElement.classList.remove('hidden');

    if (this.router.url.includes('category=' + data)) {
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: { category: null, p: 1, keyword: null },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.setLinkActive(this.router.url);
        });
    } else {
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: { category: data, p: 1, keyword: null },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.setLinkActive(this.router.url);
        });
    }
  }

  setPriceQueryParam(data: number[]) {
    this.viewmore?.nativeElement.classList.remove('hidden');

    const [start, end] = data;

    if (
      this.router.url.includes(`price=${start},${end}`) ||
      this.router.url.includes(`price=${start}`)
    ) {
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: { price: null, p: 1, keyword: null },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.setLinkActive(this.router.url);
        });
    } else {
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: {
            price: end ? start + ',' + end : start,
            p: 1,
            keyword: null,
          },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.setLinkActive(this.router.url);
        });
    }
  }

  getProduct(): void {
    this.route.queryParams.subscribe((data: any) => {
      if (data.category && data.price) {
        this.getProductCategoryPrice(+data.category, data.price, +data.p);
      } else if (data.category) {
        this.getProductCategory(+data.category, +data.p);
      } else if (data.price) {
        this.getProductPrice(data.price, +data.p);
      } else if (data.keyword) {
        this.getProductSearch(data.keyword, +data.p);
      } else {
        this.getProductAll(+data.p);
      }
    });
  }

  getProductCategory(category: number, limit: number) {
    this.productService.findAll().subscribe({
      next: (data: Product[]) => {
        this.numpage = Math.ceil(
          data.filter((item: Product) => item.CategoryID === category).length /
            8
        );

        this.products = data
          .filter((item: Product) => item.CategoryID === category)
          .reverse()
          .slice(0, limit * 8);

        this.deleteViewMore(this.numpage);
      },
    });
  }

  getProductPrice(price: string, limit: number): void {
    const [min, max] = price.split(',');

    this.productService.findAll().subscribe({
      next: (data: Product[]) => {
        this.numpage = Math.ceil(
          data.filter(
            (item: Product) => item.price >= +min && item.price <= +max
          ).length / 8
        );

        this.products = data
          .filter((item: Product) => item.price >= +min && item.price <= +max)
          .reverse()
          .slice(0, limit * 8);

        this.deleteViewMore(this.numpage);
      },
    });
  }

  getProductCategoryPrice(category: number, price: string, limit: number) {
    const [min, max] = price.split(',');

    this.productService.findAll().subscribe({
      next: (data: Product[]) => {
        this.numpage = Math.ceil(
          data.filter(
            (item: Product) =>
              item.CategoryID === category &&
              item.price >= +min &&
              item.price <= +max
          ).length / 8
        );

        this.products = data
          .filter(
            (item: Product) =>
              item.CategoryID === category &&
              item.price >= +min &&
              item.price <= +max
          )
          .reverse()
          .slice(0, limit * 8);

        this.deleteViewMore(this.numpage);
      },
    });
  }

  getProductAll(limit: number) {
    this.productService.findAll().subscribe({
      next: (data: Product[]) => {
        this.numpage = Math.ceil(data.length / 8);

        this.products = data.reverse().slice(0, limit * 8);
      },
    });
  }

  getProductSearch(keyword: string, limit: number) {
    this.productService.findAll().subscribe({
      next: (data: Product[]) => {
        this.numpage = Math.ceil(
          data.filter((item: Product) => {
            return Object.values(item).some((val: string) =>
              val.toString().toLowerCase().includes(keyword.toLowerCase())
            );
          }).length / 8
        );

        this.products = data
          .filter((item: Product) => {
            return Object.values(item).some((val: string) =>
              val.toString().toLowerCase().includes(keyword.toLowerCase())
            );
          })
          .slice(0, limit * 8);

        this.deleteViewMore(this.numpage);
      },
    });
  }

  setLinkActive(data: string): void {
    localStorage.setItem('link_active', data);
  }

  getLinkActive() {
    return localStorage.getItem('link_active');
  }

  isActive(data: string): boolean {
    const linkActive = this.getLinkActive();
    console.log(data);

    console.log(linkActive?.split('&'));

    if (linkActive?.split('&').includes(data)) {
      return true;
    } else {
      return false;
    }
  }

  viewMore(viewmore: Element): void {
    const p = +this.route.snapshot.queryParams['p'];

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { p: p + 1 },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        if (+this.route.snapshot.queryParams['p'] === this.numpage) {
          viewmore.classList.add('hidden');
        }
      });
  }

  deleteViewMore(numpage: number) {
    if (numpage === 1 || numpage === 0) {
      this.viewmore?.nativeElement.classList.add('hidden');
    }
  }
}
