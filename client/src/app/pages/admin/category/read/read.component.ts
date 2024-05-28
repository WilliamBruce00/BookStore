import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/category.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss',
})
export class ReadCategoryComponent implements OnInit {
  categories!: Category[];

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.categoryService.findAll().subscribe({
      next: (response: Category[]) => {
        this.categories = response;
        Swal.close();
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  deleteCategory(id: number): void {
    Swal.fire({
      text: 'Bạn có chắc chắn muốn xóa không?',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) {
        return;
      }

      Swal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.categoryService.delete(id).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              title: 'Thành công',
              text: 'Xóa danh mục sản phẩm thành công',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => isConfirmed && this.getCategory());
          } else {
            console.log(response);
          }
        },
      });
    });
  }
}
