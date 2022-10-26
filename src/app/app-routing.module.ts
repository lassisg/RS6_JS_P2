import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsBoComponent } from './admin/products/products-bo.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthGuard } from './auth/auth.guard';
import { ErrorComponent } from './common/error/error.component';
import { HomeComponent } from './content/home/home.component';
import { ProductDetailComponent } from './content/product-detail/product-detail.component';
import { ProductsComponent } from './content/products/products.component';
import { WishlistComponent } from './content/wishlist/wishlist.component';
import { UserComponent } from './shared/user/user.component';

const routes: Routes = [
  { path: "home", pathMatch: 'full', redirectTo: '' },
  { path: "", component: HomeComponent },
  { path: "products", component: ProductsComponent },
  { path: "product/:id", component: ProductDetailComponent },
  { path: "user", component: UserComponent },
  { path: "wishlist", component: WishlistComponent, canActivate: [AuthGuard] },
  { path: "admin/products", component: ProductsBoComponent, canActivate: [AuthGuard] },
  { path: "admin/users", component: UsersComponent, canActivate: [AuthGuard] },
  { path: "**", component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
