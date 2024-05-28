import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ShopComponent } from './pages/shop/shop.component';
import { DetailsComponent } from './pages/details/details.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { InfoComponent } from './pages/profile/info/info.component';
import { PasswordComponent } from './pages/profile/password/password.component';
import { guestGuard } from './guards/guest.guard';
import { CartComponent } from './pages/cart/cart.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { CategoryComponent } from './pages/admin/category/category.component';
import { ProductComponent } from './pages/admin/product/product.component';
import { ReadCategoryComponent } from './pages/admin/category/read/read.component';
import { ReadProductComponent } from './pages/admin/product/read/read.component';
import { CreateCategoryComponent } from './pages/admin/category/create/create.component';
import { UpdateCategoryComponent } from './pages/admin/category/update/update.component';
import { CreateProductComponent } from './pages/admin/product/create/create.component';
import { UpdateProductComponent } from './pages/admin/product/update/update.component';
import { ReadOrderComponent } from './pages/admin/order/read/read.component';
import { OrdersComponent } from './pages/admin/order/order.component';
import { OrderComponent } from './pages/profile/order/order.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home Page',
    component: HomeComponent,
  },
  {
    path: 'login',
    title: 'Login Page',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'shop',
    title: 'Shop Page',
    component: ShopComponent,
  },
  {
    path: 'details/:id',
    title: 'Details Page',
    component: DetailsComponent,
  },
  {
    path: 'register',
    title: 'Register Page',
    component: RegisterComponent,
  },
  {
    path: 'profile',
    title: 'Profile Page',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'info',
        title: 'Info Page',
        component: InfoComponent,
      },
      {
        path: 'password',
        title: 'Password Page',
        component: PasswordComponent,
      },
      {
        path: 'order',
        title: 'Order Page',
        component: OrderComponent,
      },
    ],
  },
  {
    path: 'cart',
    title: 'Cart Page',
    component: CartComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    title: 'Admin Page',
    component: AdminComponent,
    children: [
      {
        path: '',
        title: 'Dashboard Page',
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        title: 'Dashboard Page',
        component: DashboardComponent,
      },
      {
        path: 'category',
        title: 'Category Page',
        component: CategoryComponent,
        children: [
          {
            path: '',
            title: 'Category Page',
            component: ReadCategoryComponent,
          },
          {
            path: 'read',
            title: 'Category Page',
            component: ReadCategoryComponent,
          },
          {
            path: 'create',
            title: 'Category Page',
            component: CreateCategoryComponent,
          },
          {
            path: 'update/:id',
            title: 'Category Page',
            component: UpdateCategoryComponent,
          },
        ],
      },
      {
        path: 'product',
        title: 'Product Page',
        component: ProductComponent,
        children: [
          {
            path: '',
            title: 'Product Page',
            component: ReadProductComponent,
          },
          {
            path: 'read',
            title: 'Product Page',
            component: ReadProductComponent,
          },
          {
            path: 'create',
            title: 'Product Page',
            component: CreateProductComponent,
          },
          {
            path: 'update/:id',
            title: 'Product Page',
            component: UpdateProductComponent,
          },
        ],
      },
      {
        path: 'order',
        title: 'Order Page',
        component: OrdersComponent,
        children: [
          {
            path: '',
            title: 'Order Page',
            component: ReadOrderComponent,
          },
          {
            path: 'read',
            title: 'Order Page',
            component: ReadOrderComponent,
          },
        ],
      },
    ],
  },
];
