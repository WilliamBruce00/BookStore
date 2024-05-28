import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { ProductService } from '../../../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../../models/category.model';
import { Product } from '../../../../models/product.model';
import Swal from 'sweetalert2';
import { UploadService } from '../../../../services/upload.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateProductComponent implements OnInit {
  @ViewChild('img') img!: ElementRef;

  category!: Category[];
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.getCategory();
    this.getProduct();
  }

  getCategory(): void {
    this.categoryService.findAll().subscribe({
      next: (response: Category[]) => {
        this.category = response;
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  getProduct(): void {
    const id = this.route.snapshot.params['id'];

    this.productService.findOne(id).subscribe({
      next: (response: Product) => {
        this.product = response;
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  onSubmit(form: NgForm): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const id = this.route.snapshot.params['id'];

    const data = {
      ...form.value,
      page: +form.value.page,
      price: +form.value.price,
    };

    if (!form.value.img) {
      data.img = this.product.img;

      this.productService.update(id, data).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            Swal.fire({
              title: 'Thành công',
              text: 'Cập nhật sản phẩm thành công',
              icon: 'success',
              allowEnterKey: false,
            }).then(({ isConfirmed }) => {
              if (isConfirmed) location.href = 'admin/product';
            });
          } else {
            console.log(response);
          }
        },
      });
    } else {
      this.uploadService
        .upload(this.img.nativeElement.files[0])
        .pipe(
          concatMap((uploadResponse: any) => {
            const id = this.route.snapshot.params['id'];
            data.img = uploadResponse.img;
            return this.productService.update(id, data);
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật sản phẩm thành công',
                icon: 'success',
                allowOutsideClick: false,
              }).then(({ isConfirmed }) => {
                if (isConfirmed) location.href = 'admin/product';
              });
            } else {
              console.log(response);
            }
          },
          error: (err: any) => {
            throw err;
          },
        });
    }
  }
}
