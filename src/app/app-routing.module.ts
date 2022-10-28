import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsBoComponent } from './admin/products/products-bo.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthGuard } from './auth/auth.guard';
import { RestrictedGuard } from './auth/restricted.guard';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './content/home/home.component';
import { ProductDetailComponent } from './content/product-detail/product-detail.component';
import { ProductsComponent } from './content/products/products.component';
import { UserRegisterComponent } from './content/user-register/user-register.component';
import { WishlistComponent } from './content/wishlist/wishlist.component';
import { UserComponent } from './content/user/user.component';

const routes: Routes = [
  { path: "home", pathMatch: 'full', redirectTo: '' },
  { path: "", component: HomeComponent },
  { path: "products", component: ProductsComponent },
  { path: "product/:id", component: ProductDetailComponent },
  { path: "register", component: UserRegisterComponent },
  { path: "user/:id", component: UserComponent, canActivate: [AuthGuard] },
  { path: "wishlist/:id", component: WishlistComponent, canActivate: [AuthGuard] },
  { path: "admin/products", component: ProductsBoComponent, canActivate: [RestrictedGuard] },
  { path: "admin/users", component: UsersComponent, canActivate: [RestrictedGuard] },
  { path: "**", component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RestrictedGuard]
})
export class AppRoutingModule { }
