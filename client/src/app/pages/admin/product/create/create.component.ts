import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/category.model';
import { ProductService } from '../../../../services/product.service';
import { UploadService } from '../../../../services/upload.service';
import { concatMap, from } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateProductComponent implements OnInit {
  @ViewChild('img') img!: ElementRef;

  category!: Category[];

  constructor(
    private categoryService: CategoriesService,
    private productService: ProductService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.getCategory();
  }

  onSubmit(form: NgForm): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.uploadService
      .upload(this.img.nativeElement.files[0])
      .pipe(
        concatMap((uploadResponse: any) => {
          const data = {
            name: form.value.name,
            price: +form.value.price,
            auchor: form.value.auchor,
            weight: form.value.weight,
            page: +form.value.page,
            size: form.value.size,
            CategoryID: form.value.CategoryID,
            img: uploadResponse.img,
          };

          return this.productService.create(data);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.code === 201) {
            Swal.fire({
              title: 'Thành công',
              text: 'Thêm sản phẩm thành công',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => {
              if (isConfirmed) location.href = 'admin/product';
            });
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
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
}
